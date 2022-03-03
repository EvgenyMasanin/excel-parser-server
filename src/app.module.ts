import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ExcelModule } from './excel/excel.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [],
      synchronize: true,
    }),
    ExcelModule,
  ],
})
export class AppModule {}
