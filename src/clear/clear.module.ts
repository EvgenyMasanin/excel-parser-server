import { Module } from '@nestjs/common';
import { ClearService } from './clear.service';
import { ClearController } from './clear.controller';

@Module({
  controllers: [ClearController],
  providers: [ClearService]
})
export class ClearModule {}
