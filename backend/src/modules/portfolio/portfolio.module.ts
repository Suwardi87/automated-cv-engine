import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { User } from '../user/entities/user.entity';
import { GithubProject } from '../github/entities/github-project.entity';
import { GitlabProject } from '../gitlab/entities/gitlab-project.entity';
import { MediaPortfolio } from '../social/entities/media-portfolio.entity';
import { Education } from '../education/entities/education.entity';
import { WorkExperience } from '../work-experience/entities/work-experience.entity';
import { Certificate } from '../certificate/entities/certificate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GithubProject, GitlabProject, MediaPortfolio, Education, WorkExperience, Certificate])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
