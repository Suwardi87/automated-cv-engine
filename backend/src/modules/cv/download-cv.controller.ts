import { Controller, Get, Query, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { CvService } from './cv.service';

@Controller('download-cv')
export class DownloadCvController {
  constructor(private cv: CvService) {}

  @Get()
  async download(@Query('username') username: string, @Res() res: Response) {
    if (!username) throw new NotFoundException('Username wajib diisi');

    const data = await this.cv.generateByUsername(username);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="cv-${username}.json"`);
    return res.json(data);
  }
}
