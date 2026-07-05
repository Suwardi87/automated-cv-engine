import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { EducationService } from './education.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('education')
export class EducationController {
  constructor(private education: EducationService) {}

  @Get()
  async index(@CurrentUser() user: User) {
    const data = await this.education.findAll(user.id);
    return { success: true, data };
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body()
    body: {
      institution: string;
      degree: string;
      field_of_study?: string;
      start_date?: string;
      end_date?: string;
      description?: string;
      sort_order?: number;
    },
  ) {
    const data = await this.education.create(user.id, body);
    return { success: true, data };
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body()
    body: {
      institution?: string;
      degree?: string;
      field_of_study?: string;
      start_date?: string;
      end_date?: string;
      description?: string;
      sort_order?: number;
    },
  ) {
    const data = await this.education.update(+id, user.id, body);
    return { success: true, data };
  }

  @Delete(':id')
  async destroy(@CurrentUser() user: User, @Param('id') id: string) {
    await this.education.remove(+id, user.id);
    return { success: true, data: null };
  }
}
