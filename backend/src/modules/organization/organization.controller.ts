import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private organization: OrganizationService) {}

  @Get()
  async index(@CurrentUser() user: User) {
    const data = await this.organization.findAll(user.id);
    return { success: true, data };
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body()
    body: {
      name: string;
      role: string;
      start_date?: string;
      end_date?: string;
      is_current?: boolean;
      description?: string;
      highlights?: string[];
      sort_order?: number;
    },
  ) {
    const data = await this.organization.create(user.id, body);
    return { success: true, data };
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      role?: string;
      start_date?: string;
      end_date?: string;
      is_current?: boolean;
      description?: string;
      highlights?: string[];
      sort_order?: number;
    },
  ) {
    const data = await this.organization.update(+id, user.id, body);
    return { success: true, data };
  }

  @Delete(':id')
  async destroy(@CurrentUser() user: User, @Param('id') id: string) {
    await this.organization.remove(+id, user.id);
    return { success: true, data: null };
  }
}
