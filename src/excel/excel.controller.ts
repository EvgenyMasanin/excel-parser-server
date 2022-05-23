import {
  Controller,
  Get,
  Post,
  Response,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { createReadStream } from 'fs'
import path from 'path'
import fs from 'fs'
import { Public } from 'src/common/decorators'
import { FileUploadDto } from './dto/file-upload.dto'
import { ExcelService } from './excel.service'
import { Response as Res } from 'express'

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @ApiOperation({ summary: 'Getting teachers data from excel files.' })
  @ApiResponse({ status: 200 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Excel files with teachers info.',
    type: FileUploadDto,
  })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'teacherInfoFile', maxCount: 1 },
      { name: 'teacherPayloadFile', maxCount: 1 },
    ])
  )
  getStaffInfo(
    @UploadedFiles()
    files: {
      teacherInfoFile: Express.Multer.File[]
      teacherPayloadFile: Express.Multer.File[]
    }
  ) {
    return this.excelService.getStaffInfo(files.teacherInfoFile[0], files.teacherPayloadFile[0])
  }

  @Post('upload-files')
  @UseInterceptors(AnyFilesInterceptor())
  generateTimetable(
    @UploadedFiles()
    files: Express.Multer.File[]
  ) {
    const fileWithPayload = files.find((file) => file.fieldname === 'fileWithPayload')

    const filesWithTimetables = files.filter((file) => file.fieldname !== 'fileWithPayload')

    return this.excelService.getStaffInfoTestWithFiles(fileWithPayload, filesWithTimetables)
  }

  @Public()
  @Get('test')
  getStaffInfoTest() {
    return this.excelService.getStaffInfoTest()
  }

  @Get('timetable')
  getTimetable() {
    return this.excelService.getTimeTable()
  }

  @Public()
  @Get('file-with-timetable')
  async getFile(@Response({ passthrough: true }) res: Res) {
    const { fileReadStream, fileName } = await this.excelService.getFileWithTimetable()

    res.set({
      'Content-Disposition': `${fileName}`,
      'Content-Type': 'application/json',
      'Access-Control-Expose-Headers': 'Content-Disposition',
    })

    return new StreamableFile(fileReadStream)
  }
}
