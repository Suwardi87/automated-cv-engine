import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { GithubProject } from '../github/entities/github-project.entity';
import { GitlabProject } from '../gitlab/entities/gitlab-project.entity';
import { MediaPortfolio } from '../social/entities/media-portfolio.entity';
import { Education } from '../education/entities/education.entity';
import { WorkExperience } from '../work-experience/entities/work-experience.entity';
import { Certificate } from '../certificate/entities/certificate.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(GithubProject)
    private githubRepo: Repository<GithubProject>,
    @InjectRepository(GitlabProject)
    private gitlabRepo: Repository<GitlabProject>,
    @InjectRepository(MediaPortfolio)
    private mediaRepo: Repository<MediaPortfolio>,
    @InjectRepository(Education)
    private educationRepo: Repository<Education>,
    @InjectRepository(WorkExperience)
    private workRepo: Repository<WorkExperience>,
    @InjectRepository(Certificate)
    private certRepo: Repository<Certificate>,
  ) {}

  async findByUsername(username: string) {
    let user = await this.userRepo.findOneBy({ username });
    if (!user) {
      user = await this.userRepo.findOneBy({ name: username });
    }
    if (!user) return null;
    const [github_projects, gitlab_projects, media_portfolios, educations, work_experiences, certificates] = await Promise.all([
      this.githubRepo.find({
        where: { user_id: user.id },
        order: { last_pushed_at: 'DESC' },
        select: ['id', 'title', 'slug', 'ai_summary', 'tech_stack', 'repo_url', 'live_url', 'primary_language', 'stars_count', 'forks_count', 'is_featured', 'last_pushed_at'],
      }),
      this.gitlabRepo.find({
        where: { user_id: user.id },
        order: { last_pushed_at: 'DESC' },
        select: ['id', 'title', 'slug', 'ai_summary', 'tech_stack', 'repo_url', 'live_url', 'is_featured', 'last_pushed_at'],
      }),
      this.mediaRepo.find({ where: { user_id: user.id }, order: { posted_at: 'DESC' } }),
      this.educationRepo.find({
        where: { user_id: user.id },
        order: { sort_order: 'ASC' },
      }),
      this.workRepo.find({
        where: { user_id: user.id },
        order: { sort_order: 'ASC' },
      }),
      this.certRepo.find({
        where: { user_id: user.id },
        order: { sort_order: 'ASC' },
      }),
    ]);
    return {
      user: { name: user.name, bio: user.bio, avatar_url: user.avatar_url },
      github_projects,
      gitlab_projects,
      media_portfolios,
      educations,
      work_experiences,
      certificates,
    };
  }
}
