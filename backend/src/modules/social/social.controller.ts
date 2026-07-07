import { Controller, Post, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('social')
export class SocialController {
  constructor(private social: SocialService) {}

  @Post('sync')
  async sync(@CurrentUser() user: User) {
    return this.social.sync(user);
  }
}
