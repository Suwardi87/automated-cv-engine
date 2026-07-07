import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GithubProject } from './entities/github-project.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GithubProject]), AuthModule],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
