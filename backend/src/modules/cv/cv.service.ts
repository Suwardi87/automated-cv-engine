import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { GithubProject } from '../github/entities/github-project.entity';
import { Education } from '../education/entities/education.entity';
import { WorkExperience } from '../work-experience/entities/work-experience.entity';
import { Certificate } from '../certificate/entities/certificate.entity';
import { AiService, CvData } from '../../services/ai.service';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(GithubProject)
    private githubRepo: Repository<GithubProject>,
    @InjectRepository(Education)
    private educationRepo: Repository<Education>,
    @InjectRepository(WorkExperience)
    private workRepo: Repository<WorkExperience>,
    @InjectRepository(Certificate)
    private certRepo: Repository<Certificate>,
    private ai: AiService,
  ) {}

  async generate(userId: number): Promise<CvData> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const [repos, educations, workExperiences, certificates] = await Promise.all([
      this.githubRepo.find({
        where: { user_id: userId },
        order: { last_pushed_at: 'DESC' },
      }),
      this.educationRepo.find({
        where: { user_id: userId },
        order: { sort_order: 'ASC' },
      }),
      this.workRepo.find({
        where: { user_id: userId },
        order: { sort_order: 'ASC' },
      }),
      this.certRepo.find({
        where: { user_id: userId },
        order: { sort_order: 'ASC' },
      }),
    ]);

    const cvData = await this.ai.generateCvContent({
      name: user.name,
      email: user.email,
      bio: user.bio,
      repos: repos.map((r) => ({
        title: r.title,
        tech_stack: r.tech_stack,
        ai_summary: r.ai_summary,
        repo_url: r.repo_url,
        live_url: r.live_url,
        languages: r.languages,
        topics: r.topics,
        recent_commits: r.recent_commits,
        stars_count: r.stars_count,
        forks_count: r.forks_count,
        is_fork: r.is_fork,
      })),
    });

    cvData.education = educations.map((e) => ({
      degree: `${e.degree}${e.field_of_study ? ` - ${e.field_of_study}` : ''}`,
      school: e.institution,
      period: [e.start_date, e.end_date].filter(Boolean).join(' — ') || '-',
      note: e.description || '',
    }));

    const expHighlights = workExperiences.map((w) => ({
      role: w.position,
      company: w.company,
      period: [w.start_date, w.is_current ? 'Saat Ini' : w.end_date].filter(Boolean).join(' — '),
      bullets: w.highlights?.length ? w.highlights : w.description ? [w.description] : [],
    }));
    if (expHighlights.length) {
      cvData.experiences = [...expHighlights, ...cvData.experiences].slice(0, 6);
    }

    cvData.certificates = certificates.map((c) => `${c.name} — ${c.issuer}`);

    return cvData;
  }

  async generateByUsername(username: string): Promise<CvData> {
    const user = await this.userRepo.findOneBy({ username });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.generate(user.id);
  }
}
