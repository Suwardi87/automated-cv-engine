import { Injectable, HttpException, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GithubProject } from './entities/github-project.entity';
import { User } from '../user/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { AiService } from '../../services/ai.service';
import { ScreenshotService } from './screenshot.service';
import axios from 'axios';

interface GithubApiRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  pushed_at: string;
  language: string | null;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  forks_count: number;
  owner: { login: string };
}

interface GithubCommit {
  sha: string;
  commit: { message: string; author: { date: string } };
}

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    @InjectRepository(GithubProject)
    private repo: Repository<GithubProject>,
    private auth: AuthService,
    private ai: AiService,
    private screenshot: ScreenshotService,
  ) {}

  findAll(userId: number) {
    return this.repo.find({ where: { user_id: userId }, order: { last_pushed_at: 'DESC' } });
  }

  findOne(id: number, userId: number) {
    return this.repo.findOneByOrFail({ id, user_id: userId });
  }

  findAllWithLiveUrl(userId: number) {
    return this.repo.find({
      where: { user_id: userId },
      order: { is_featured: 'DESC', last_pushed_at: 'DESC' },
    });
  }

  async sync(user: User) {
    const accessToken = await this.auth.getAccessToken(user.id, 'github');
    if (!accessToken) {
      throw new HttpException('GitHub account not connected', HttpStatus.BAD_REQUEST);
    }

    const res = await axios.get<GithubApiRepo[]>('https://api.github.com/user/repos', {
      params: { per_page: 100, sort: 'pushed', affiliation: 'owner' },
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
    });

    const existing = await this.repo.find({ where: { user_id: user.id } });
    const byRepoId = new Map(existing.map((p) => [p.repo_id, p]));
    const seen = new Set<string>();

    for (const item of res.data) {
      const repoId = String(item.id);
      seen.add(repoId);

      if (item.fork || item.archived) {
        if (byRepoId.has(repoId)) {
          await this.repo.remove(byRepoId.get(repoId)!);
          byRepoId.delete(repoId);
        }
        continue;
      }

      const owner = item.owner?.login || item.full_name?.split('/')[0] || '';
      if (!owner) continue;

      const slug = `github-${user.id}-${item.full_name.replace(/\//g, '-')}`;
      const row = byRepoId.get(repoId) ?? this.repo.create({ user_id: user.id, repo_id: repoId });
      row.title = item.name;
      row.slug = slug;
      row.repo_url = item.html_url;
      row.live_url = item.homepage ?? '';
      row.primary_language = item.language ?? '';
      row.stars_count = item.stargazers_count;
      row.forks_count = item.forks_count;
      row.is_fork = item.fork;
      row.is_archived = item.archived;
      row.last_pushed_at = new Date(item.pushed_at);
      row.ai_summary = row.ai_summary ?? item.description ?? '';

      const needsDeepSync = !row.last_synced_at || row.last_synced_at < row.last_pushed_at;
      if (needsDeepSync) {
        try {
          const results = await Promise.allSettled([
            this.fetchReadme(accessToken, owner, item.name),
            this.fetchLanguages(accessToken, owner, item.name),
            this.fetchTopics(accessToken, owner, item.name),
            this.fetchCommits(accessToken, owner, item.name),
          ]);

          const readme = results[0].status === 'fulfilled' ? results[0].value : null;
          const langData = results[1].status === 'fulfilled' ? results[1].value : null;
          const topicData = results[2].status === 'fulfilled' ? results[2].value : null;
          const commitData = results[3].status === 'fulfilled' ? results[3].value : null;

          row.raw_readme = readme ?? '';
          row.languages = langData ?? {};
          row.topics = topicData ?? [];

          const detected = [...new Set([item.language ?? '', ...Object.keys(langData ?? {})].filter(Boolean))] as string[];
          row.tech_stack = detected.length > 0 ? detected : (row.tech_stack ?? []);

          row.recent_commits = commitData ?? [];

          if (readme && !row.ai_summary) {
            const summary = await this.ai.summarizeReadme(readme);
            if (summary) row.ai_summary = summary;
          }

          row.last_synced_at = new Date();
        } catch {
        }
      }

      byRepoId.set(repoId, row);
    }

    const toSave = [...byRepoId.values()].filter((p) => seen.has(p.repo_id));
    if (toSave.length) await this.repo.save(toSave);

    const activeRepoIds = new Set(res.data.map((r: any) => String(r.id)));
    const staleProjects = existing.filter(p => !activeRepoIds.has(p.repo_id));
    if (staleProjects.length > 0) {
      await this.repo.remove(staleProjects);
    }

    this.triggerScreenshotsForNewLiveUrls(user.id);

    return { synced: toSave.length };
  }

  private triggerScreenshotsForNewLiveUrls(userId: number): void {
    Promise.resolve()
      .then(async () => {
        const candidates = await this.repo.find({
          where: { user_id: userId },
          order: { is_featured: 'DESC', last_pushed_at: 'DESC' },
        });
        const needs = candidates.filter((p) => !p.screenshot_url);
        if (needs.length === 0) return;
        this.logger.log(
          `Auto-screenshot: ${needs.length} project(s) without screenshot (live_url + repo fallback)`,
        );
        const result = await this.screenshot.captureMany(needs);
        this.logger.log(
          `Auto-screenshot done: ${result.succeeded}/${result.total} sukses, ${result.failed} gagal`,
        );
      })
      .catch((err) => {
        this.logger.error(
          `Auto-screenshot failed: ${err instanceof Error ? err.message : String(err)}`,
        );
      });
  }

  private async fetchReadme(token: string, owner: string, repo: string): Promise<string | null> {
    try {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.raw+json',
        },
        timeout: 10000,
      });
      return typeof res.data === 'string' ? res.data.slice(0, 50000) : null;
    } catch {
      return null;
    }
  }

  private async fetchLanguages(token: string, owner: string, repo: string): Promise<Record<string, number>> {
    try {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000,
      });
      return res.data ?? {};
    } catch {
      return {};
    }
  }

  private async fetchTopics(token: string, owner: string, repo: string): Promise<string[]> {
    try {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/topics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.mercy-preview+json',
        },
        timeout: 8000,
      });
      return res.data?.names ?? [];
    } catch {
      return [];
    }
  }

  private async fetchCommits(token: string, owner: string, repo: string) {
    try {
      const res = await axios.get<GithubCommit[]>(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        {
          params: { per_page: 10 },
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        },
      );
      return (res.data ?? []).map((c) => ({
        message: c.commit.message.split('\n')[0].slice(0, 200),
        date: c.commit.author?.date ?? '',
        sha: c.sha.slice(0, 7),
      }));
    } catch {
      return [];
    }
  }

  async getAggregatedSkills(userId: number) {
    const projects = await this.repo.find({
      where: { user_id: userId },
      select: ['tech_stack', 'topics', 'languages', 'primary_language'],
    });

    const exclude = new Set([
      'swift', 'lua', 'objective-c', 'cmake', 'c', 'c++',
      'dart-generated', 'llvm', 'assembly', 'kotlin',
    ]);

    const langCategories: Record<string, string> = {
      javascript: 'language', typescript: 'language', python: 'language', go: 'language',
      rust: 'language', kotlin: 'language', java: 'language', 'c++': 'language',
      'c#': 'language', php: 'language', ruby: 'language', swift: 'language',
      dart: 'language', scala: 'language', lua: 'language', perl: 'language',
    };

    const count = new Map<string, { count: number; category: string }>();

    for (const p of projects) {
      const all = [
        ...(p.tech_stack ?? []),
        ...(p.topics ?? []),
        ...(p.primary_language ? [p.primary_language] : []),
        ...Object.keys(p.languages ?? {}),
      ];

      for (const name of [...new Set(all)]) {
        if (!name || exclude.has(name.toLowerCase())) continue;
        const existing = count.get(name) ?? { count: 0, category: 'tool' };
        existing.count += 1;
        if (langCategories[name.toLowerCase()]) existing.category = 'language';
        else if (['react','vue','angular','svelte','next.js','nuxt','express','nestjs','fastify','django','flask','spring','rails','laravel','tailwind','bootstrap','jquery','flutter','react native','electron','prisma','typeorm','drizzle','mongoose','sequelize'].includes(name.toLowerCase())) existing.category = 'framework';
        else if (['postgresql','mysql','mongodb','redis','sqlite','mariadb','cassandra','dynamodb','firebase','supabase','elasticsearch'].includes(name.toLowerCase())) existing.category = 'database';
        count.set(name, existing);
      }
    }

    return [...count.entries()]
      .map(([name, meta]) => ({ name, count: meta.count, category: meta.category }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }

  async toggleFeature(id: number, userId: number) {
    const project = await this.repo.findOneBy({ id, user_id: userId });
    if (!project) throw new NotFoundException('Proyek tidak ditemukan');
    project.is_featured = !project.is_featured;
    return this.repo.save(project);
  }

  async toggleVisibility(id: number, userId: number) {
    const project = await this.repo.findOneBy({ id, user_id: userId });
    if (!project) throw new NotFoundException('Proyek tidak ditemukan');
    project.is_hidden = !project.is_hidden;
    return this.repo.save(project);
  }

  private detectLiveUrlFromReadme(readme: string | null): string | null {
    if (!readme) return null;

    const skipHosts = [
      'github.com', 'githubusercontent.com', 'gitlab.com', 'gitlab.io',
      'npmjs.com', 'lab.padang.go.id',
      'facebook.github.io', 'create-react-app', 'webpack.js.org',
      'nodejs.org', 'vuejs.org', 'laravel.com', 'tailwindcss.com',
      'linkedin.com', 'twitter.com', 'x.com', 'instagram.com',
      'medium.com', 'stackoverflow.com', 'youtube.com', 'youtu.be',
      'wikipedia.org', 'google.com',
      'vercel.com', 'netlify.com', 'nuxt.com', 'nextjs.org',
      'reactjs.org', 'angular.io', 'svelte.dev',
      'docker.com', 'kubernetes.io',
    ];

    const deployPatterns = [
      /\.vercel\.app/i,
      /\.netlify\.app/i,
      /\.pages\.dev/i,
      /\.surge\.sh/i,
      /\.onrender\.com/i,
      /\.fly\.dev/i,
      /\.herokuapp\.com/i,
      /\.github\.io/i,
      /\.padang\.go\.id/i,
      /\.go\.id/i,
    ];

    const urlRegex = /https?:\/\/[^\s\)\(\[\]\"\'`<>,]+/gi;
    const matches = readme.match(urlRegex) ?? [];

    for (const rawUrl of matches) {
      const url = rawUrl.replace(/[.,!?;:]$/, '');
      if (skipHosts.some((h) => url.toLowerCase().includes(h))) continue;
      if (deployPatterns.some((p) => p.test(url))) {
        return url;
      }
    }

    const lines = readme.split('\n');
    const keywordRegex = /(demo|live|preview|deploy|website|kunjungi|link| deployment)/i;
    for (const line of lines) {
      if (!keywordRegex.test(line)) continue;
      const urls = line.match(urlRegex) ?? [];
      for (const rawUrl of urls) {
        const url = rawUrl.replace(/[.,!?;:]$/, '');
        if (skipHosts.some((h) => url.toLowerCase().includes(h))) continue;
        if (/^https?:\/\//.test(url) && !url.includes('localhost')) {
          return url;
        }
      }
    }

    return null;
  }

  private async guessLiveUrlByPattern(project: GithubProject): Promise<string | null> {
    const title = (project.title ?? '').toLowerCase();
    if (!title) return null;

    const knownMappings: Array<{ match: RegExp; url: string }> = [
      { match: /^mobile_?damkar$/i, url: 'https://simpatik.disdamkar.padang.go.id' },
      { match: /^web-?damkar$/i, url: 'https://simpatik.disdamkar.padang.go.id' },
      { match: /^web-?pariwisata$/i, url: 'https://pariwisata.padang.go.id' },
      { match: /^web-?jdih$/i, url: 'https://jdih.dprd.padang.go.id' },
      { match: /^web-?dispora$/i, url: 'https://dispora.padang.go.id' },
      { match: /^web-?ldpi$/i, url: 'https://ldpi.padang.go.id' },
      { match: /^web-?dp3p3kb$/i, url: 'https://dp3p3kb.padang.go.id' },
      { match: /^dispora$/i, url: 'https://dispora.padang.go.id' },
      { match: /^ldpi$/i, url: 'https://ldpi.padang.go.id' },
      { match: /^jdih$/i, url: 'https://jdih.dprd.padang.go.id' },
    ];

    for (const { match, url } of knownMappings) {
      if (match.test(title)) {
        try {
          const reachable = await this.checkUrlReachable(url);
          if (reachable) return url;
        } catch {
          // not reachable, skip
        }
      }
    }

    if (title.startsWith('web-')) {
      const sub = title.slice(4);
      const candidate = `https://${sub}.padang.go.id`;
      try {
        const reachable = await this.checkUrlReachable(candidate);
        if (reachable) return candidate;
      } catch {
        // skip
      }
    }

    return null;
  }

  private async checkUrlReachable(url: string): Promise<boolean> {
    try {
      const res = await axios.head(url, {
        timeout: 6000,
        maxRedirects: 5,
        validateStatus: (s) => s >= 200 && s < 400,
      });
      return res.status >= 200 && res.status < 400;
    } catch {
      return false;
    }
  }

  async autodetectLiveUrls(userId: number) {
    const projects = await this.repo.find({
      where: { user_id: userId },
      order: { is_featured: 'DESC', last_pushed_at: 'DESC' },
    });

    const updates: Array<{ id: number; title: string; old: string | null; new: string }> = [];
    const toSave: GithubProject[] = [];

    for (const project of projects) {
      const hasLiveUrl = !!(project.live_url && project.live_url.trim());
      if (hasLiveUrl) continue;

      const fromReadme = this.detectLiveUrlFromReadme(project.raw_readme);
      if (fromReadme) {
        project.live_url = fromReadme;
        project.screenshot_url = null;
        toSave.push(project);
        updates.push({ id: project.id, title: project.title, old: project.live_url, new: fromReadme });
        continue;
      }

      const fromPattern = await this.guessLiveUrlByPattern(project);
      if (fromPattern) {
        project.live_url = fromPattern;
        project.screenshot_url = null;
        toSave.push(project);
        updates.push({ id: project.id, title: project.title, old: null, new: fromPattern });
      }
    }

    if (toSave.length > 0) {
      await this.repo.save(toSave);
      this.logger.log(`Auto-detect: ${toSave.length} project(s) dapat live_url baru`);

      Promise.resolve()
        .then(async () => {
          const result = await this.screenshot.captureMany(toSave);
          this.logger.log(
            `Auto-screenshot setelah detect: ${result.succeeded}/${result.total} sukses`,
          );
        })
        .catch((err) => {
          this.logger.error(
            `Auto-screenshot setelah detect failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        });
    }

    return {
      detected: updates.length,
      updates: updates.map((u) => ({ id: u.id, title: u.title, live_url: u.new })),
    };
  }

  async updateLiveUrl(id: number, userId: number, liveUrl: string) {
    const project = await this.repo.findOneBy({ id, user_id: userId });
    if (!project) throw new NotFoundException('Proyek tidak ditemukan');
    const trimmed = (liveUrl ?? '').trim();
    project.live_url = trimmed || null;
    if (!trimmed) project.screenshot_url = null;
    const saved = await this.repo.save(project);

    if (trimmed) {
      Promise.resolve()
        .then(() => this.screenshot.captureScreenshot(saved))
        .catch((err) => {
          this.logger.error(
            `Auto-screenshot after live_url update failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        });
    }

    return saved;
  }
}
