import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { SocialAccount } from './entities/social-account.entity';
import { MediaPortfolio } from './entities/media-portfolio.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SocialAccount, MediaPortfolio, User]), AuthModule],
  controllers: [SocialController],
  providers: [SocialService],
})
export class SocialModule {}
