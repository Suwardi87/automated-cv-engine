import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import puppeteer, { Browser } from 'puppeteer-core';
import { GithubProject } from './entities/github-project.entity';

const SCREENSHOTS_DIR = join(process.cwd(), 'static', 'screenshots');
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 720;
const NAV_TIMEOUT = 20000;

@Injectable()
export class ScreenshotService {
  private readonly logger = new Logger(ScreenshotService.name);

  constructor(
    @InjectRepository(GithubProject)
    private repo: Repository<GithubProject>,
  ) {}

  private async resolveChromePath(): Promise<string> {
    const candidates = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
    ];
    for (const p of candidates) {
      if (p && existsSync(p)) return p;
    }
    throw new Error('Chrome/Chromium executable not found');
  }

  async captureScreenshot(project: GithubProject): Promise<string | null> {
    if (!project.live_url) {
      this.logger.warn(`Project "${project.title}" has no live_url, skipping`);
      return null;
    }

    try {
      await mkdir(SCREENSHOTS_DIR, { recursive: true });
    } catch {
      // ignore, directory exists
    }

    const executablePath = await this.resolveChromePath();
    const filename = `${project.slug}.png`;
    const outputPath = join(SCREENSHOTS_DIR, filename);
    const publicUrl = `/static/screenshots/${filename}`;

    let browser: Browser | null = null;
    try {
      browser = await puppeteer.launch({
        executablePath,
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-translate',
          '--disable-background-networking',
          '--disable-sync',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-first-run',
          `--window-size=${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}`,
        ],
      });

      const page = await browser.newPage();
      await page.setViewport({
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
        deviceScaleFactor: 1,
      });

      await page.setDefaultNavigationTimeout(NAV_TIMEOUT);

      await page.goto(project.live_url, {
        waitUntil: 'networkidle2',
        timeout: NAV_TIMEOUT,
      });

      await new Promise((r) => setTimeout(r, 1500));

      await page.screenshot({
        path: outputPath,
        type: 'png',
        clip: { x: 0, y: 0, width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
      });

      project.screenshot_url = publicUrl;
      await this.repo.save(project);

      this.logger.log(`Screenshot saved for project "${project.title}"`);
      return publicUrl;
    } catch (err) {
      this.logger.error(
        `Failed to screenshot "${project.title}": ${err instanceof Error ? err.message : String(err)}`,
      );
      return null;
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch {
          // ignore
        }
      }
    }
  }

  async captureMany(projects: GithubProject[]): Promise<{
    total: number;
    succeeded: number;
    failed: number;
    results: Array<{ id: number; title: string; success: boolean; screenshot_url?: string | null }>;
  }> {
    const results: Array<{ id: number; title: string; success: boolean; screenshot_url?: string | null }> = [];
    let succeeded = 0;
    let failed = 0;

    for (const project of projects) {
      const url = await this.captureScreenshot(project);
      const ok = url !== null;
      if (ok) succeeded++;
      else failed++;
      results.push({ id: project.id, title: project.title, success: ok, screenshot_url: url });
    }

    return { total: projects.length, succeeded, failed, results };
  }
}
