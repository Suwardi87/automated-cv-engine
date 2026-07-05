import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';

interface CreateCertificateDto {
  name: string;
  issuer: string;
  description?: string;
  credential_url?: string;
  issue_date?: string;
  expiry_date?: string;
  sort_order?: number;
}

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private repo: Repository<Certificate>,
  ) {}

  findAll(userId: number) {
    return this.repo.find({ where: { user_id: userId }, order: { sort_order: 'ASC' } });
  }

  create(userId: number, dto: CreateCertificateDto) {
    const cert = this.repo.create({ user_id: userId, ...dto });
    return this.repo.save(cert);
  }

  async update(id: number, userId: number, dto: Partial<CreateCertificateDto>) {
    const cert = await this.repo.findOneBy({ id, user_id: userId });
    if (!cert) throw new NotFoundException('Sertifikat tidak ditemukan');
    Object.assign(cert, dto);
    return this.repo.save(cert);
  }

  async remove(id: number, userId: number) {
    const cert = await this.repo.findOneBy({ id, user_id: userId });
    if (!cert) throw new NotFoundException('Sertifikat tidak ditemukan');
    return this.repo.remove(cert);
  }
}
