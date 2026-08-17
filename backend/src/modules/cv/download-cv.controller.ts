import { Controller, Get, Query, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { CvService } from './cv.service';
import { CvPdfService } from './cv-pdf.service';

@Controller('download-cv')
export class DownloadCvController {
  constructor(
    private cv: CvService,
    private pdf: CvPdfService,
  ) {}

  @Get()
  async download(
    @Query('username') username: string,
    @Query('format') format: string,
    @Res() res: Response,
  ) {
    if (!username) throw new NotFoundException('Username wajib diisi');

    const data = await this.cv.generateByUsername(username);

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="cv-${username}.json"`);
      return res.json(data);
    }

    try {
      const meta = await this.cv.findUserMeta(username);
      const buffer = await this.pdf.renderPdf(data, meta);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="CV-${meta.name.replace(/[^a-zA-Z0-9 .-]/g, '').trim() || username}.pdf"`,
      );
      return res.send(buffer);
    } catch (err) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        success: false,
        message: 'Gagal generate PDF',
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
