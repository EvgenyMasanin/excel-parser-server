import { Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'
import { FileUploadDto } from './dto/file-upload.dto'
import { ExcelService } from './excel.service'

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
}
