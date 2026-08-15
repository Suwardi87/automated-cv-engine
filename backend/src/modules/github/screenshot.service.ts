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
    const hasLiveUrl = !!(project.live_url && project.live_url.trim());
    const hasRepoUrl = !!(project.repo_url && project.repo_url.trim());

    if (!hasLiveUrl && !hasRepoUrl) {
      this.logger.warn(`Project "${project.title}" has no live_url or repo_url, skipping`);
      return null;
    }

    if (this.isMobileProject(project)) {
      this.logger.log(`Project "${project.title}" terdeteksi mobile app — pakai custom card`);
      return this.generateCustomCard(project);
    }

    if (hasLiveUrl) {
      const liveShot = await this.captureUrl(project, project.live_url as string, true);
      if (liveShot) return liveShot;
      this.logger.warn(`Live capture failed for "${project.title}", falling back to custom card`);
    }

    return this.generateCustomCard(project);
  }

  private async captureUrl(
    project: GithubProject,
    targetUrl: string,
    isLive: boolean,
  ): Promise<string | null> {
    try {
      await mkdir(SCREENSHOTS_DIR, { recursive: true });
    } catch {
      // ignore
    }

    const executablePath = await this.resolveChromePath();
    const filename = `${project.slug}.png`;
    const outputPath = join(SCREENSHOTS_DIR, filename);
    const publicUrl = `/static/screenshots/${filename}`;

    let browser: Browser | null = null;
    try {
      browser = await this.launchBrowser(executablePath);
      const page = await browser.newPage();
      await page.setViewport({
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
        deviceScaleFactor: 1,
      });
      await page.setDefaultNavigationTimeout(NAV_TIMEOUT);
      await page.goto(targetUrl, {
        waitUntil: 'networkidle2',
        timeout: NAV_TIMEOUT,
      });
      await this.settlePage(page, isLive);
      await page.screenshot({
        path: outputPath,
        type: 'png',
        clip: { x: 0, y: 0, width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
      });

      project.screenshot_url = publicUrl;
      await this.repo.save(project);

      this.logger.log(`Screenshot saved for project "${project.title}" (${isLive ? 'live' : 'url'})`);
      return publicUrl;
    } catch (err) {
      this.logger.error(
        `Failed to screenshot "${project.title}" at ${targetUrl}: ${err instanceof Error ? err.message : String(err)}`,
      );
      return null;
    } finally {
      if (browser) {
        try { await browser.close(); } catch { /* ignore */ }
      }
    }
  }

  private isMobileProject(project: GithubProject): boolean {
    if (/^mobile[-_]/i.test(project.title ?? '')) return true;
    const langs = [
      project.primary_language ?? '',
      ...(project.tech_stack ?? []),
    ].map((s) => s.toLowerCase());
    return langs.includes('dart') || langs.includes('flutter');
  }

  private async settlePage(page: import('puppeteer-core').Page, isLive: boolean): Promise<void> {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let scrolled = false;
        const step = () => {
          if (scrolled) {
            window.scrollTo(0, 0);
            resolve();
            return;
          }
          scrolled = true;
          window.scrollTo(0, document.body.scrollHeight);
          setTimeout(step, 600);
        };
        step();
      });
    });

    await page.evaluate(async () => {
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.addEventListener('load', () => resolve(), { once: true });
                img.addEventListener('error', () => resolve(), { once: true });
                setTimeout(resolve, 8000);
              }),
        ),
      );
    });

    await new Promise((r) => setTimeout(r, isLive ? 3000 : 1200));
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 300));
  }

  private async generateCustomCard(project: GithubProject): Promise<string | null> {
    try {
      await mkdir(SCREENSHOTS_DIR, { recursive: true });
    } catch {
      // ignore
    }

    const executablePath = await this.resolveChromePath();
    const filename = `${project.slug}.png`;
    const outputPath = join(SCREENSHOTS_DIR, filename);
    const publicUrl = `/static/screenshots/${filename}`;

    const techStack = (project.tech_stack ?? []).slice(0, 8);
    const summary = (project.ai_summary ?? '').trim() || 'Project repository — klik untuk lihat detail di GitHub.';
    const language = project.primary_language ?? '';
    const stars = project.stars_count ?? 0;
    const forks = project.forks_count ?? 0;
    const title = (project.title ?? 'Untitled').replace(/[<>&"']/g, '');
    const safeSummary = summary.replace(/[<>&"']/g, '');
    const safeLanguage = language.replace(/[<>&"']/g, '');

    const techBadges = techStack
      .map((t) => `<span class="tech">${(t ?? '').replace(/[<>&"']/g, '')}</span>`)
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${VIEWPORT_WIDTH}px;
    height: ${VIEWPORT_HEIGHT}px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: linear-gradient(135deg, #09090b 0%, #18181b 100%);
    color: #fafafa;
    overflow: hidden;
    position: relative;
  }
  .glow-1 {
    position: absolute;
    top: -100px; left: 30%;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%);
    pointer-events: none;
  }
  .glow-2 {
    position: absolute;
    bottom: -150px; right: 10%;
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(217, 70, 239, 0.10), transparent 70%);
    pointer-events: none;
  }
  .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }
  .container {
    position: relative;
    padding: 56px 64px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
  }
  .github-mark {
    width: 56px; height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(24, 24, 27, 0.6);
    border: 1px solid rgba(63, 63, 70, 0.6);
    border-radius: 14px;
    backdrop-filter: blur(8px);
  }
  .github-mark svg { width: 28px; height: 28px; fill: #a1a1aa; }
  .repo-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(39, 39, 42, 0.8);
    border: 1px solid rgba(63, 63, 70, 0.8);
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    color: #d4d4d8;
    letter-spacing: 0.05em;
    backdrop-filter: blur(8px);
  }
  .repo-badge::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #71717a;
  }
  .title {
    font-size: 42px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.025em;
    background: linear-gradient(135deg, #ffffff 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    word-break: break-word;
    max-width: 90%;
  }
  .summary {
    margin-top: 20px;
    font-size: 16px;
    line-height: 1.6;
    color: #a1a1aa;
    max-width: 90%;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 28px;
  }
  .tech {
    padding: 6px 14px;
    background: rgba(24, 24, 27, 0.6);
    border: 1px solid rgba(82, 82, 91, 0.5);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #d4d4d8;
    backdrop-filter: blur(4px);
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24px;
    border-top: 1px solid rgba(39, 39, 42, 0.6);
  }
  .stats {
    display: flex;
    align-items: center;
    gap: 24px;
    font-size: 14px;
    color: #71717a;
  }
  .lang {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .lang-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #a78bfa;
    box-shadow: 0 0 12px rgba(167, 139, 250, 0.6);
  }
  .star {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .star-icon {
    color: #fbbf24;
  }
  .fork {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .hint {
    font-size: 12px;
    color: #52525b;
    font-style: italic;
  }
</style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="glow-1"></div>
  <div class="glow-2"></div>
  <div class="container">
    <div>
      <div class="header">
        <div class="github-mark">
          <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </div>
        <span class="repo-badge">REPOSITORY</span>
      </div>
      <h1 class="title">${title}</h1>
      <p class="summary">${safeSummary}</p>
      ${techBadges ? `<div class="tech-list">${techBadges}</div>` : ''}
    </div>
    <div class="footer">
      <div class="stats">
        ${safeLanguage ? `<span class="lang"><span class="lang-dot"></span>${safeLanguage}</span>` : ''}
        <span class="star"><span class="star-icon">★</span>${stars}</span>
        <span class="fork">⑂ ${forks}</span>
      </div>
      <span class="hint">Lihat di GitHub →</span>
    </div>
  </div>
</body>
</html>`;

    let browser: Browser | null = null;
    try {
      browser = await this.launchBrowser(executablePath);
      const page = await browser.newPage();
      await page.setViewport({
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
        deviceScaleFactor: 1,
      });
      await page.setContent(html, { waitUntil: 'load', timeout: 10000 });
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({
        path: outputPath,
        type: 'png',
        clip: { x: 0, y: 0, width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
      });

      project.screenshot_url = publicUrl;
      await this.repo.save(project);

      this.logger.log(`Custom card generated for "${project.title}"`);
      return publicUrl;
    } catch (err) {
      this.logger.error(
        `Custom card failed for "${project.title}": ${err instanceof Error ? err.message : String(err)}`,
      );
      return null;
    } finally {
      if (browser) {
        try { await browser.close(); } catch { /* ignore */ }
      }
    }
  }

  private async launchBrowser(executablePath: string): Promise<Browser> {
    return puppeteer.launch({
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
