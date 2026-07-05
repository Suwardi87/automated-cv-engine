import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index,
} from 'typeorm';
import { SocialAccount } from '../../social/entities/social-account.entity';
import { GithubProject } from '../../github/entities/github-project.entity';
import { GitlabProject } from '../../gitlab/entities/gitlab-project.entity';
import { MediaPortfolio } from '../../social/entities/media-portfolio.entity';
import { Certificate } from '../../certificate/entities/certificate.entity';
import { WorkExperience } from '../../work-experience/entities/work-experience.entity';
import { Education } from '../../education/entities/education.entity';
import { Organization } from '../../organization/entities/organization.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ length: 255, nullable: true })
  avatar_url: string;

  @Column({ length: 100, unique: true, nullable: true })
  username: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ length: 255, nullable: true })
  linkedin: string;

  @Column({ length: 255, nullable: true })
  job_title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SocialAccount, (sa) => sa.user)
  social_accounts: SocialAccount[];

  @OneToMany(() => GithubProject, (gp) => gp.user)
  github_projects: GithubProject[];

  @OneToMany(() => GitlabProject, (gp) => gp.user)
  gitlab_projects: GitlabProject[];

  @OneToMany(() => MediaPortfolio, (mp) => mp.user)
  media_portfolios: MediaPortfolio[];

  @OneToMany(() => WorkExperience, (we) => we.user)
  work_experiences: WorkExperience[];

  @OneToMany(() => Education, (e) => e.user)
  educations: Education[];

  @OneToMany(() => Organization, (o) => o.user)
  organizations: Organization[];

  @OneToMany(() => Certificate, (c) => c.user)
  certificates: Certificate[];
}
