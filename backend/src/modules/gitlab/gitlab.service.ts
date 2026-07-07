import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GitlabProject } from './entities/gitlab-project.entity';
import { User } from '../user/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import axios from 'axios';

interface GitlabApiProject {
  id: number;
  name: string;
  path_with_namespace: string;
  description: string | null;
  web_url: string;
  last_activity_at: string;
  topics?: string[];
  homepage?: string | null;
}

@Injectable()
export class GitlabService {
  constructor(
    @InjectRepository(GitlabProject)
    private repo: Repository<GitlabProject>,
    private auth: AuthService,
  ) {}

  findAll(userId: number) {
    return this.repo.find({ where: { user_id: userId }, order: { last_pushed_at: 'DESC' } });
  }

  async sync(user: User) {
    const accessToken = await this.auth.getAccessToken(user.id, 'gitlab');
    if (!accessToken) {
      throw new HttpException('GitLab account not connected', HttpStatus.BAD_REQUEST);
    }

    const res = await axios.get<GitlabApiProject[]>('https://gitlab.com/api/v4/projects', {
      params: { membership: true, per_page: 100, order_by: 'last_activity_at' },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const existing = await this.repo.find({ where: { user_id: user.id } });
    const byRepoId = new Map(existing.map((p) => [p.repo_id, p]));
    const seen = new Set<string>();

    for (const item of res.data) {
      const repoId = String(item.id);
      seen.add(repoId);
      const slug = `gitlab-${item.path_with_namespace.replace(/\//g, '-')}`;
      const row = byRepoId.get(repoId) ?? this.repo.create({ user_id: user.id, repo_id: repoId });
      row.title = item.name;
      row.slug = slug;
      row.repo_url = item.web_url;
      row.live_url = item.homepage ?? '';
      row.ai_summary = row.ai_summary ?? item.description;
      row.tech_stack = item.topics && item.topics.length ? item.topics : row.tech_stack ?? [];
      row.last_pushed_at = new Date(item.last_activity_at);
      byRepoId.set(repoId, row);
    }

    const toSave = [...byRepoId.values()].filter((p) => seen.has(p.repo_id));
    if (toSave.length) await this.repo.save(toSave);

    return { synced: toSave.length };
  }

  async toggleFeature(id: number, userId: number) {
    const project = await this.repo.findOneBy({ id, user_id: userId });
    if (!project) throw new NotFoundException('Proyek tidak ditemukan');
    project.is_featured = !project.is_featured;
    return this.repo.save(project);
  }
}
