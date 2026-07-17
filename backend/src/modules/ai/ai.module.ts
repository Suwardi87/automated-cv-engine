import { Global, Module } from '@nestjs/common';
import { AiService } from '../../services/ai.service';
import { AiImproveController } from './ai-improve.controller';

@Global()
@Module({
  controllers: [AiImproveController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
