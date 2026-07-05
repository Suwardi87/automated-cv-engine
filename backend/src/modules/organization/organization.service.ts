import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';

interface CreateOrganizationDto {
  name: string;
  role: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  highlights?: string[];
  sort_order?: number;
}

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private repo: Repository<Organization>,
  ) {}

  findAll(userId: number) {
    return this.repo.find({ where: { user_id: userId }, order: { sort_order: 'ASC' } });
  }

  async create(userId: number, dto: CreateOrganizationDto) {
    const organization = this.repo.create({ ...dto, user_id: userId });
    return this.repo.save(organization);
  }

  async update(id: number, userId: number, dto: Partial<CreateOrganizationDto>) {
    const organization = await this.repo.findOneBy({ id, user_id: userId });
    if (!organization) throw new NotFoundException('Organisasi tidak ditemukan');
    Object.assign(organization, dto);
    return this.repo.save(organization);
  }

  async remove(id: number, userId: number) {
    const organization = await this.repo.findOneBy({ id, user_id: userId });
    if (!organization) throw new NotFoundException('Organisasi tidak ditemukan');
    return this.repo.remove(organization);
  }
}
