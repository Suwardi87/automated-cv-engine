import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import aiConfig from './config/ai.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { GithubModule } from './modules/github/github.module';
import { GitlabModule } from './modules/gitlab/gitlab.module';
import { SocialModule } from './modules/social/social.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { CvModule } from './modules/cv/cv.module';
import { EducationModule } from './modules/education/education.module';
import { WorkExperienceModule } from './modules/work-experience/work-experience.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, redisConfig, aiConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
        },
      }),
    }),
    AiModule,
    AuthModule,
    UserModule,
    GithubModule,
    GitlabModule,
    SocialModule,
    PortfolioModule,
    CvModule,
    WorkExperienceModule,
    EducationModule,
    CertificateModule,
    OrganizationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
