import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { ExcelModule } from './excel/excel.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ExcelModule,
  ],
})
export class AppModule {}
