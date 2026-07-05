import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WorkExperienceService } from './work-experience.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('work-experience')
export class WorkExperienceController {
  constructor(private service: WorkExperienceService) {}

  @Get()
  async index(@CurrentUser() user: User) {
    const data = await this.service.findAll(user.id);
    return { success: true, data };
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body()
    body: {
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
    const data = await this.service.create(user.id, body);
    return { success: true, data };
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body()
    body: {
      company?: string;
      position?: string;
      location?: string;
      start_date?: string;
      end_date?: string;
      is_current?: boolean;
      description?: string;
      highlights?: string[];
      sort_order?: number;
    },
  ) {
    const data = await this.service.update(+id, user.id, body);
    return { success: true, data };
  }

  @Delete(':id')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    await this.service.remove(+id, user.id);
    return { success: true };
  }
}
