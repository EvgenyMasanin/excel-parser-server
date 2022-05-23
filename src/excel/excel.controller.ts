import {
  Controller,
  Get,
  Post,
  Response,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { createReadStream } from 'fs'
import path from 'path'
import fs from 'fs'
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

  @Public()
  @Get('file-with-timetable')
  getFile(@Response({ passthrough: true }) res): StreamableFile {
    const fileNames = fs.readdirSync(`${process.cwd()}/static/timetables`)
    const files = fileNames.map((fileName) => {
      const fileStat = fs.statSync(`${process.cwd()}/static/timetables/${fileName}`)
      return {
        name: fileName,
        birthtime: Date.now() - fileStat.birthtimeMs,
        birthDate: fileStat.birthtime,
      }
    })

    const sorted = files.sort((a, b) => a.birthtime - b.birthtime)
    const youngestFile = sorted[0]
    console.log('🚀 ~ getFile ~ youngestFile', youngestFile)
    const file = createReadStream(
      path.join(process.cwd(), `static/timetables/${youngestFile.name}`)
    )
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `${youngestFile.name}`,
      'Access-Control-Expose-Headers': 'Content-Disposition',
    })
    return new StreamableFile(file)
  }
}
