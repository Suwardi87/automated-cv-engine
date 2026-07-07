import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  index() {
    return { app: 'OmniSync Portfolio API', version: '1.0' };
  }
}
