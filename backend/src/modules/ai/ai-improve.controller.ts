import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AiService } from '../../services/ai.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiImproveController {
  constructor(private ai: AiService) {}

  @Post('improve')
  async improve(@Body() body: { text: string; context?: string }) {
    if (!body.text?.trim()) {
      throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
    }
    const improved = await this.ai.improveText(body.text, body.context || 'deskripsi profesional');
    return { success: true, data: { original: body.text, improved } };
  }
}
