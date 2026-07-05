import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('certificates')
export class CertificateController {
  constructor(private certificate: CertificateService) {}

  @Get()
  async index(@CurrentUser() user: User) {
    const data = await this.certificate.findAll(user.id);
    return { success: true, data };
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() body: {
      name: string; issuer: string; description?: string;
      credential_url?: string; issue_date?: string; expiry_date?: string; sort_order?: number;
    },
  ) {
    const data = await this.certificate.create(user.id, body);
    return { success: true, data };
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: {
      name?: string; issuer?: string; description?: string;
      credential_url?: string; issue_date?: string; expiry_date?: string; sort_order?: number;
    },
  ) {
    const data = await this.certificate.update(+id, user.id, body);
    return { success: true, data };
  }

  @Delete(':id')
  async destroy(@CurrentUser() user: User, @Param('id') id: string) {
    await this.certificate.remove(+id, user.id);
    return { success: true, data: null };
  }
}
