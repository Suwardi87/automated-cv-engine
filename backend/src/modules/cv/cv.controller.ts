import { Controller, Get, Post, UseGuards, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CvService } from './cv.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cv')
export class CvController {
  constructor(private cv: CvService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@CurrentUser() user: User) {
    const data = await this.cv.generate(user.id);
    return { success: true, data };
  }
}
