import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitlabController } from './gitlab.controller';
import { GitlabService } from './gitlab.service';
import { GitlabProject } from './entities/gitlab-project.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GitlabProject]), AuthModule],
  controllers: [GitlabController],
  providers: [GitlabService],
})
export class GitlabModule {}
