import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { GithubService } from './github.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('github')
export class GithubController {
  constructor(private github: GithubService) {}

  @Get('repos')
  async index(@CurrentUser() user: User) {
    const data = await this.github.findAll(user.id);
    return { success: true, data };
  }

  @Post('sync')
  async sync(@CurrentUser() user: User) {
    return this.github.sync(user);
  }

  @Post(':project/toggle-feature')
  async toggleFeature(@CurrentUser() user: User, @Param('project') project: string) {
    const data = await this.github.toggleFeature(+project, user.id);
    return { success: true, data };
  }
}
