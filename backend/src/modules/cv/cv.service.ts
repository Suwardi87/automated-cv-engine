import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { GithubProject } from '../github/entities/github-project.entity';
import { Education } from '../education/entities/education.entity';
import { WorkExperience } from '../work-experience/entities/work-experience.entity';
import { Certificate } from '../certificate/entities/certificate.entity';
import { Organization } from '../organization/entities/organization.entity';
import { CvData } from '../../services/ai.service';

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
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
  ) {}

  private fmtDate(d: string | null, isCurrent = false): string {
    if (isCurrent) return 'Sekarang';
    if (!d) return '';
    try {
      return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    } catch {
      return '';
    }
  }

  private fmtPeriod(start?: string | null, end?: string | null, isCurrent?: boolean): string {
    return [this.fmtDate(start ?? null), this.fmtDate(end ?? null, isCurrent)].filter(Boolean).join(' — ');
  }

  async generate(userId: number): Promise<CvData> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const [repos, educations, workExperiences, certificates, organizations] = await Promise.all([
      this.githubRepo.find({ where: { user_id: userId, is_hidden: false }, order: { last_pushed_at: 'DESC' } }),
      this.educationRepo.find({ where: { user_id: userId }, order: { sort_order: 'ASC' } }),
      this.workRepo.find({ where: { user_id: userId }, order: { sort_order: 'ASC' } }),
      this.certRepo.find({ where: { user_id: userId }, order: { sort_order: 'ASC' } }),
      this.orgRepo.find({ where: { user_id: userId }, order: { sort_order: 'ASC' } }),
    ]);

    const exclude = /^(swift|lua|objective-c|cmake|c\+\+|dart-generated|llvm|assembly|c$|plpgsql|hack|less|go template|kotlin|dockerfile|scss)$/i;
    const techSet = new Set<string>();
    repos.forEach((r) => {
      [...(r.tech_stack || []), ...(r.topics || []), r.primary_language].forEach((t) => {
        if (t && !exclude.test(t.trim())) techSet.add(t.trim());
      });
    });

    const priority = /^(vue|react|next|nuxt|angular|svelte|php|laravel|go|node|typescript|javascript|python|dart|flutter|kotlin|java|mysql|postgresql|mongodb|redis|docker|kubernetes|aws|nginx|tailwind|bootstrap|express|nestjs|django|flask|spring|blade)/i;
    const sortedTech = [...techSet].sort((a, b) => {
      const aP = priority.test(a) ? 0 : 1;
      const bP = priority.test(b) ? 0 : 1;
      return aP - bP;
    });

    const featuredRepos = repos
      .filter((r) => r.is_featured)
      .sort((a, b) => (b.stars_count || 0) - (a.stars_count || 0));

    const allRepos = [...featuredRepos, ...repos.filter((r) => !r.is_featured)];

    const profileLinks = [
      user.website,
      user.linkedin,
      `GitHub: github.com/${user.username}`,
    ].filter(Boolean).join(' | ');

    return {
      profil: user.bio || `${user.name} — ${user.job_title || 'Developer'}`,
      technicalSkills: sortedTech.length > 0
        ? sortedTech.slice(0, 20)
        : ['PHP', 'JavaScript', 'Laravel', 'Vue.js'],
      softSkills: [
        'Problem Solving & Analytical Thinking',
        'Adaptability & Fast Learning',
        'Team Collaboration & Communication',
        'Time Management & Prioritization',
      ],
      experiences: workExperiences.map((w) => ({
        role: w.position,
        company: w.company,
        period: this.fmtPeriod(w.start_date, w.end_date, w.is_current),
        bullets: [
          ...(w.highlights || []),
          ...(w.description ? [w.description] : []),
        ],
      })),
      education: educations.map((e) => ({
        degree: `${e.degree}${e.field_of_study ? ` — ${e.field_of_study}` : ''}`,
        school: e.institution,
        period: this.fmtPeriod(e.start_date, e.end_date),
        note: e.description || '',
      })),
      organizations: organizations.map((o) => ({
        role: o.role,
        company: o.name,
        period: this.fmtPeriod(o.start_date, o.end_date, o.is_current),
        bullets: [
          ...(o.highlights || []),
          ...(o.description ? [o.description] : []),
        ],
      })),
      certificates: certificates.map((c) =>
        `${c.name} — ${c.issuer} (${this.fmtDate(c.issue_date)})`,
      ),
      portfolioLinks: allRepos.slice(0, 7).map((r) => {
        const feat = r.is_featured ? '★ ' : '';
        const stack = (r.tech_stack || []).filter((t) => !exclude.test(t)).slice(0, 4).join(', ');
        const summary = r.ai_summary ? `: ${r.ai_summary.slice(0, 100)}` : '';
        return `${feat}${r.title} (${stack})${summary} — ${r.repo_url}`;
      }).join('\n'),
    };
  }

  async generateByUsername(username: string): Promise<CvData> {
    const user = await this.userRepo.findOneBy({ username });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.generate(user.id);
  }
}
