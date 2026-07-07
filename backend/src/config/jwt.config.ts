import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || (() => { console.warn('[SECURITY] JWT_SECRET not set — using insecure default. Set JWT_SECRET env var for production.'); return 'omnisync-jwt-secret-dev-change-me'; })(),
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));
