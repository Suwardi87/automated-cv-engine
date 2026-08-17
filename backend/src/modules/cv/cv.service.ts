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

  private deriveSoftSkills(workCount: number, orgCount: number, repoCount: number): string[] {
    const skills: string[] = [];
    if (workCount > 0) {
      skills.push('Koordinasi lintas stakeholder & pengumpulan requirement instansi');
      skills.push('Dokumentasi teknis & penulisan panduan sistem');
    }
    if (orgCount > 0) skills.push('Kepemimpinan tim & manajemen konflik');
    if (repoCount > 15) skills.push('Manajemen beberapa proyek paralel & prioritasi');
    skills.push('Problem solving berbasis data & debugging sistematis');
    skills.push('Belajar mandiri teknologi baru (self-taught, dokumentasi resmi)');
    return skills.slice(0, 5);
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

    const exclude = /^(swift|lua|objective-c|cmake|c\+\+|c$|dart-generated|llvm|assembly|plpgsql|hack|less|go template|kotlin|dockerfile|scss|smarty|makefile|gradle|blade|shell|jupyter notebook)$/i;
    const techSet = new Set<string>();
    repos.forEach((r) => {
      [...(r.tech_stack || []), ...(r.topics || []), r.primary_language].forEach((t) => {
        if (t && !exclude.test(t.trim())) techSet.add(t.trim());
      });
    });

    const evidence = [
      user.job_title,
      user.bio,
      ...workExperiences.flatMap((w) => [w.description ?? '', ...(w.highlights ?? [])]),
      ...repos.map((r) => r.ai_summary ?? ''),
    ]
      .join(' ')
      .toLowerCase();

    const coreMap: Array<[RegExp, string]> = [
      [/laravel/, 'Laravel'],
      [/vue/, 'Vue.js'],
      [/nuxt/, 'Nuxt.js'],
      [/typescript/, 'TypeScript'],
      [/javascript/, 'JavaScript'],
      [/\bphp\b/, 'PHP'],
      [/flutter|\bdart\b/, 'Flutter & Dart'],
      [/mysql|mariadb/, 'MySQL'],
      [/postgres/, 'PostgreSQL'],
      [/rest api/, 'REST API'],
      [/tailwind/, 'Tailwind CSS'],
      [/bootstrap/, 'Bootstrap'],
      [/docker/, 'Docker'],
      [/postman/, 'Postman'],
      [/nestjs/, 'NestJS'],
      [/inertia/, 'Inertia.js'],
    ];
    const coreSkills = coreMap.filter(([re]) => re.test(evidence)).map(([, label]) => label);
    const alias: Record<string, string> = { vue: 'Vue.js', nuxt: 'Nuxt.js', dart: 'Flutter & Dart' };
    const coreLower = new Set(coreSkills.map((s) => s.toLowerCase()));

    const priority = /^(vue|react|next|nuxt|angular|svelte|php|laravel|go|node|typescript|javascript|python|dart|flutter|kotlin|java|mysql|postgresql|mongodb|redis|docker|kubernetes|aws|nginx|tailwind|bootstrap|express|nestjs|django|flask|spring)/i;
    const extras = [...techSet]
      .filter((t) => {
        const norm = alias[t.toLowerCase()] ?? t;
        return !coreLower.has(norm.toLowerCase());
      })
      .sort((a, b) => {
        const aP = priority.test(a) ? 0 : 1;
        const bP = priority.test(b) ? 0 : 1;
        return aP - bP;
      });

    const sortedTech = [...coreSkills, ...extras];

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
      softSkills: this.deriveSoftSkills(workExperiences.length, organizations.length, repos.length),
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
      certificates: certificates.map((c) => {
        const date = this.fmtDate(c.issue_date);
        return `${c.name} — ${c.issuer}${date ? ` (${date})` : ''}`;
      }),
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

  async findUserMeta(username: string) {
    const user = await this.userRepo.findOneBy({ username });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return {
      name: user.name,
      jobTitle: user.job_title ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      location: user.location ?? '',
      website: user.website ?? '',
      linkedin: user.linkedin ?? '',
      github: user.username ? `github.com/${user.username}` : '',
    };
  }
}
