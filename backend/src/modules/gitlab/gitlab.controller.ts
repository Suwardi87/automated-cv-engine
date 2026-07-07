import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { GitlabService } from './gitlab.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('gitlab')
export class GitlabController {
  constructor(private gitlab: GitlabService) {}

  @Get('repos')
  async index(@CurrentUser() user: User) {
    const data = await this.gitlab.findAll(user.id);
    return { success: true, data };
  }

  @Post('sync')
  async sync(@CurrentUser() user: User) {
    return this.gitlab.sync(user);
  }

  @Post(':project/toggle-feature')
  async toggleFeature(@CurrentUser() user: User, @Param('project') project: string) {
    const data = await this.gitlab.toggleFeature(+project, user.id);
    return { success: true, data };
  }
}
