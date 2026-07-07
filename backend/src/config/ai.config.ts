import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  geminiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
}));
