import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'omnisync',
  password: process.env.DB_PASSWORD || (() => { console.warn('[CONFIG] DB_PASSWORD not set — using insecure default. Set DB_PASSWORD env var.'); return 'omnisync_secret'; })(),
  database: process.env.DB_DATABASE || 'omnisync',
}));
