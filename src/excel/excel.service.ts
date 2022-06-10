import { Injectable, InternalServerErrorException } from '@nestjs/common'
import xlsx from 'xlsx'
import { TeachersService } from './teachers.service'
import { SubjectsService } from './subjects.service'
import { ClearService } from 'src/clear/clear.service'
import { TimetableService } from './timetable.service'
import { ExcelHelperService } from './excel-helper.service'
import { TeachersPayloadService } from './teachers-payload.service'
import { ExcelRepositoryService } from './excel-repository.service'
import { TimetableFileGeneratorService } from './timetable-file-generator.service'
import { createReadStream, readdirSync, ReadStream, statSync } from 'fs'
import path from 'path'

@Injectable()
export class ExcelService {
  constructor(
    private readonly excelHelperService: ExcelHelperService,
    private readonly teachersService: TeachersService,
    private readonly subjectService: SubjectsService,
    private readonly teachersPayloadService: TeachersPayloadService,
    private readonly timetableService: TimetableService,
    private readonly excelRepositoryService: ExcelRepositoryService,
    private readonly timetableFileGeneratorService: TimetableFileGeneratorService,
    private readonly clearService: ClearService
  ) {}

  getStaffInfoTest() {
    return this.getStaffInfo({} as any, {} as any)
  }

  async getStaffInfo(
    teacherInfoFile: Express.Multer.File,
    teacherPayloadFile: Express.Multer.File
  ) {
    const teacherInfoFilePath = 'static/Staff_of_the_department_ASU.xlsm'
    const teacherPayloadFilePath = 'static/staff.xlsm'

    const teachersInfoFile = xlsx.readFile(teacherInfoFilePath)
    const teachersPayloadFile = xlsx.readFile(teacherPayloadFilePath)
    // const teachersInfoFile = xlsx.read(teacherInfoFile.buffer)
    // const teachersPayloadFile = xlsx.read(teacherPayloadFile.buffer)

    const firstSemesterData = teachersInfoFile.Sheets['СведенияОсень']
    const secondSemesterData = teachersInfoFile.Sheets['СведенияВесна']

    const teachersPayloadData = teachersPayloadFile.Sheets['Распределение РБ']

    const firstSemesterTable = this.excelHelperService.toTableFormat(firstSemesterData)
    const secondSemesterTable = this.excelHelperService.toTableFormat(secondSemesterData)

    const teachersPayloadTable = this.excelHelperService.toTableFormat(teachersPayloadData)

    const firstSemesterTeachers = this.teachersService.getTeachers(firstSemesterTable, 'first')
    const secondSemesterTeachers = this.teachersService.getTeachers(secondSemesterTable, 'second')
    const teachers = this.teachersService.mergeTeachers(
      firstSemesterTeachers,
      secondSemesterTeachers
    )

    const teachersPayload = this.teachersPayloadService.getTeachersPayload(teachersPayloadTable)

    const teachers1 = this.subjectService.setHoursPerSemester(teachers, teachersPayload)
    // const teachers1 = this.subjectService.setHoursPerSemester(
    //   firstSemesterTeachers,
    //   teachersPayload
    // )
    const timeTable = this.getTimeTable()

    const testDataTeachers = this.teachersService.setLessonDataToTeachers(teachers1, timeTable)

    // await this.excelRepositoryService.saveToDB(testDataTeachers)
    // await this.timetableFileGeneratorService.generate('first')
    // return teachers1
    return testDataTeachers
  }

  getTimeTable() {
    const file1 = 'static/ATF_1.xlsx'
    const file2 = 'static/ATF_2.xlsx'
    const file3 = 'static/ATF_3.xlsx'
    const file4 = 'static/ATF_4_new.xlsx'
    const file5 = 'static/ATF_5.xlsx'
    const files = [file1, file2, file3, file4, file5]
    // const files = [file4]

    return files.map((file) => {
      const table = xlsx.readFile(file)
      const timeTable = this.timetableService.getTimetable(
        this.excelHelperService.toTableFormat(table.Sheets['Table 1']),
        table.Sheets['Table 1']['!merges']
      )
      return timeTable
    })
  }

  async getStaffInfoTestWithFiles(
    fileWithPayload: Express.Multer.File,
    filesWithTimetables: Express.Multer.File[]
  ) {
    const clearResult = await this.clearService.clearDB()

    if (!clearResult)
      throw new InternalServerErrorException('Error deleting data from the database')

    try {
      const fileWithPayloadRead = xlsx.read(fileWithPayload.buffer)

      const firstSemesterData = fileWithPayloadRead.Sheets['СведенияОсень']
      const secondSemesterData = fileWithPayloadRead.Sheets['СведенияВесна']

      const teachersPayloadData = fileWithPayloadRead.Sheets['Распределение РБ']

      const firstSemesterTable = this.excelHelperService.toTableFormat(firstSemesterData)
      const secondSemesterTable = this.excelHelperService.toTableFormat(secondSemesterData)

      const teachersPayloadTable = this.excelHelperService.toTableFormat(teachersPayloadData)

      const firstSemesterTeachers = this.teachersService.getTeachers(firstSemesterTable, 'first')
      const secondSemesterTeachers = this.teachersService.getTeachers(secondSemesterTable, 'second')
      const teachers = this.teachersService.mergeTeachers(
        firstSemesterTeachers,
        secondSemesterTeachers
      )

      const teachersPayload = this.teachersPayloadService.getTeachersPayload(teachersPayloadTable)

      const teachersWithFullData = this.subjectService.setHoursPerSemester(
        teachers,
        teachersPayload
      )

      const timeTable = this.getTimeTableTestWithFiles(filesWithTimetables)

      const dataToDB = this.teachersService.setLessonDataToTeachers(teachersWithFullData, timeTable)

      await this.excelRepositoryService.saveToDB(dataToDB)
      await this.timetableFileGeneratorService.generate()

      return 'Success'
    } catch (error) {
      throw new InternalServerErrorException('Error reading files')
    }
  }

  getTimeTableTestWithFiles(filesWithTimetables: Express.Multer.File[]) {
    return filesWithTimetables.map((file) => {
      const table = xlsx.read(file.buffer)
      const timeTable = this.timetableService.getTimetable(
        this.excelHelperService.toTableFormat(table.Sheets['Table 1']),
        table.Sheets['Table 1']['!merges']
      )
      return timeTable
    })
  }

  async getFileWithTimetable(): Promise<{ fileReadStream: ReadStream; fileName: string }> {
    const dirPath = path.join(process.cwd(), '/static-files/timetables')

    const fileNames = readdirSync(dirPath)

    if (fileNames.length === 0) {
      await this.timetableFileGeneratorService.generate()
      return await this.getFileWithTimetable()
    }

    const files = fileNames.map((fileName) => {
      const fileStat = statSync(path.join(dirPath, fileName))
      return {
        name: fileName,
        birthtime: Date.now() - fileStat.birthtimeMs,
      }
    })

    const sorted = files.sort((a, b) => a.birthtime - b.birthtime)
    const youngestFile = sorted[0]
    const fileReadStream = createReadStream(path.join(dirPath, youngestFile.name))
    return { fileReadStream, fileName: youngestFile.name }
  }

  async getDesignGuidFile() {
    const filePath = path.join(process.cwd(), '/static-files/help/design-guide.docx')

    return createReadStream(filePath)
  }
}
