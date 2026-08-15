import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { GithubService } from './github.service';
import { ScreenshotService } from './screenshot.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('github')
export class GithubController {
  constructor(
    private github: GithubService,
    private screenshot: ScreenshotService,
  ) {}

  @Get('repos')
  async index(@CurrentUser() user: User) {
    const data = await this.github.findAll(user.id);
    return { success: true, data };
  }

  @Get('skills')
  async skills(@CurrentUser() user: User) {
    const data = await this.github.getAggregatedSkills(user.id);
    return { success: true, data };
  }

  @Post('sync')
  async sync(@CurrentUser() user: User) {
    return this.github.sync(user);
  }

  @Post('autodetect-urls')
  async autodetect(@CurrentUser() user: User) {
    const data = await this.github.autodetectLiveUrls(user.id);
    return { success: true, data };
  }

  @Post(':project/toggle-feature')
  async toggleFeature(@CurrentUser() user: User, @Param('project') project: string) {
    const data = await this.github.toggleFeature(+project, user.id);
    return { success: true, data };
  }

  @Post(':project/toggle-visibility')
  async toggleVisibility(@CurrentUser() user: User, @Param('project') project: string) {
    const data = await this.github.toggleVisibility(+project, user.id);
    return { success: true, data };
  }

  @Put(':project/live-url')
  async updateLiveUrl(
    @CurrentUser() user: User,
    @Param('project') project: string,
    @Body('live_url') liveUrl: string,
  ) {
    const data = await this.github.updateLiveUrl(+project, user.id, liveUrl ?? '');
    return { success: true, data };
  }

  @Post('screenshot/:project')
  async captureScreenshot(@CurrentUser() user: User, @Param('project') project: string) {
    const target = await this.github.findOne(+project, user.id);
    const data = await this.screenshot.captureScreenshot(target);
    return { success: data !== null, screenshot_url: data, data };
  }

  @Post('screenshot-all')
  async captureAll(@CurrentUser() user: User) {
    const targets = await this.github.findAll(user.id);
    const data = await this.screenshot.captureMany(targets);
    return { success: true, data };
  }
}
