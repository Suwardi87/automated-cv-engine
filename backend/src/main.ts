import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' });

  const staticDir = join(process.cwd(), 'static');
  if (!existsSync(staticDir)) mkdirSync(staticDir, { recursive: true });
  app.useStaticAssets(staticDir, { prefix: '/static/' });

  const port = config.get<number>('app.port', 9000);
  await app.listen(port);
  console.log(`OmniSync API running on port ${port}`);
}
bootstrap();
