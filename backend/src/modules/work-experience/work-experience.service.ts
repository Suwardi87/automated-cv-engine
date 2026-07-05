import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkExperience } from './entities/work-experience.entity';

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(WorkExperience)
    private repo: Repository<WorkExperience>,
  ) {}

  findAll(userId: number) {
    return this.repo.find({ where: { user_id: userId }, order: { sort_order: 'ASC' } });
  }

  async create(
    userId: number,
    dto: {
      company: string;
      position: string;
      location?: string;
      start_date?: string;
      end_date?: string;
      is_current?: boolean;
      description?: string;
      highlights?: string[];
      sort_order?: number;
    },
  ) {
    const record = this.repo.create({ user_id: userId, ...dto });
    return this.repo.save(record);
  }

  async update(
    id: number,
    userId: number,
    dto: Partial<{
      company: string;
      position: string;
      location: string;
      start_date: string;
      end_date: string;
      is_current: boolean;
      description: string;
      highlights: string[];
      sort_order: number;
    }>,
  ) {
    const record = await this.repo.findOneBy({ id, user_id: userId });
    if (!record) throw new NotFoundException('Pengalaman kerja tidak ditemukan');
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: number, userId: number) {
    const record = await this.repo.findOneBy({ id, user_id: userId });
    if (!record) throw new NotFoundException('Pengalaman kerja tidak ditemukan');
    return this.repo.remove(record);
  }
}
