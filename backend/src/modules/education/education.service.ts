import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';

interface CreateEducationDto {
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  sort_order?: number;
}

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private repo: Repository<Education>,
  ) {}

  findAll(userId: number) {
    return this.repo.find({ where: { user_id: userId }, order: { sort_order: 'ASC' } });
  }

  async create(userId: number, dto: CreateEducationDto) {
    const education = this.repo.create({ ...dto, user_id: userId });
    return this.repo.save(education);
  }

  async update(id: number, userId: number, dto: Partial<CreateEducationDto>) {
    const education = await this.repo.findOneBy({ id, user_id: userId });
    if (!education) throw new NotFoundException('Pendidikan tidak ditemukan');
    Object.assign(education, dto);
    return this.repo.save(education);
  }

  async remove(id: number, userId: number) {
    const education = await this.repo.findOneBy({ id, user_id: userId });
    if (!education) throw new NotFoundException('Pendidikan tidak ditemukan');
    return this.repo.remove(education);
  }
}
