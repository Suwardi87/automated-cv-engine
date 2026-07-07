import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('github_projects')
@Index('UQ_github_project_user_repo', ['user_id', 'repo_id'], { unique: true })
export class GithubProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 255 })
  repo_id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  raw_readme: string;

  @Column({ type: 'text', nullable: true })
  ai_summary: string;

  @Column({ type: 'jsonb', nullable: true })
  tech_stack: string[];

  @Column({ type: 'jsonb', nullable: true })
  languages: Record<string, number>;

  @Column({ type: 'jsonb', nullable: true })
  topics: string[];

  @Column({ type: 'jsonb', nullable: true })
  recent_commits: { message: string; date: string; sha: string }[];

  @Column({ length: 255 })
  repo_url: string;

  @Column({ length: 255, nullable: true })
  live_url: string;

  @Column({ length: 100, nullable: true })
  primary_language: string;

  @Column({ default: false })
  is_fork: boolean;

  @Column({ default: false })
  is_archived: boolean;

  @Column({ default: 0 })
  stars_count: number;

  @Column({ default: 0 })
  forks_count: number;

  @Column({ default: false })
  is_featured: boolean;

  @Index('IDX_github_project_user_pushed', ['user_id', 'last_pushed_at'])
  @Column({ type: 'timestamp' })
  last_pushed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_synced_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (u) => u.github_projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
