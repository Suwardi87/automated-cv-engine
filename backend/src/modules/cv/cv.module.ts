import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvController } from './cv.controller';
import { DownloadCvController } from './download-cv.controller';
import { CvService } from './cv.service';
import { User } from '../user/entities/user.entity';
import { GithubProject } from '../github/entities/github-project.entity';
import { Education } from '../education/entities/education.entity';
import { WorkExperience } from '../work-experience/entities/work-experience.entity';
import { Certificate } from '../certificate/entities/certificate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GithubProject, Education, WorkExperience, Certificate])],
  controllers: [CvController, DownloadCvController],
  providers: [CvService],
})
export class CvModule {}
