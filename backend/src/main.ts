import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' });
  const port = config.get<number>('app.port', 9000);
  await app.listen(port);
  console.log(`OmniSync API running on port ${port}`);
}
bootstrap();
