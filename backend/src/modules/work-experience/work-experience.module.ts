import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperienceController } from './work-experience.controller';
import { WorkExperienceService } from './work-experience.service';
import { WorkExperience } from './entities/work-experience.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkExperience]), AuthModule],
  controllers: [WorkExperienceController],
  providers: [WorkExperienceService],
  exports: [WorkExperienceService],
})
export class WorkExperienceModule {}
