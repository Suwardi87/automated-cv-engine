import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GithubProject } from './entities/github-project.entity';
import { User } from '../user/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { AiService } from '../../services/ai.service';
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
  constructor(
    @InjectRepository(GithubProject)
    private repo: Repository<GithubProject>,
    private auth: AuthService,
    private ai: AiService,
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
      params: { per_page: 100, sort: 'pushed' },
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

    return { synced: toSave.length };
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
}
