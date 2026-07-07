import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolio: PortfolioService) {}

  @Get(':username')
  async show(@Param('username') username: string) {
    const data = await this.portfolio.findByUsername(username);
    if (!data) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return { success: true, data };
  }
}
