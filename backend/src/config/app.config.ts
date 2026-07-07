import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'OmniSync Portfolio',
  env: process.env.APP_ENV || 'local',
  debug: process.env.APP_DEBUG === 'true',
  url: process.env.APP_URL || 'http://localhost:8082',
  port: parseInt(process.env.APP_PORT || '9000', 10),
}));
