import { ApiProperty } from '@nestjs/swagger'

export class FileUploadDto {
  @ApiProperty({ type: 'fileName.xlsx' })
  teacherInfoFile: Express.Multer.File[]
  @ApiProperty({ type: 'fileName.xlsx' })
  teacherPayloadFile: Express.Multer.File[]
}
