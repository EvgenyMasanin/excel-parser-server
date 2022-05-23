import { Injectable } from '@nestjs/common'
import { SubjectsService as ExcelSubjectsService } from './subjects.service'
import { GroupsService } from 'src/groups/groups.service'
import { TeachersService } from 'src/teachers/teachers.service'
import { SubjectsService } from 'src/subjects/subjects.service'
import { TimetableService } from 'src/timetable/timetable.service'
import { CreateTimetableDto } from 'src/timetable/dto/create-timetable.dto'
import { SubGroupNumber } from './types'
import ExcelTeacher from './types/teacher.types'

@Injectable()
export class ExcelRepositoryService {
  constructor(
    private readonly teacherService: TeachersService,
    private readonly subjectService: SubjectsService,
    private readonly groupService: GroupsService,
    private readonly timetableService: TimetableService,
    private readonly excelSubjectService: ExcelSubjectsService,
    private readonly subjectHoursService: SubjectsService
  ) {}

  async saveToDB(teachers: ExcelTeacher[]) {
    for (const { subjects, ...createTeacherDto } of teachers) {
      const teacherDB = await this.teacherService.findOneOrCreate(createTeacherDto)

      for (const subject of subjects) {
        const subjectDB = await this.subjectService.findOneOrCreate({
          name: subject.name,
        })

        const teacherToSubjectDB = await this.teacherService.findOneOrCreateTeacherToSubject({
          teacherId: teacherDB.id,
          subjectId: subjectDB.id,
        })

        for (const { name, subGroupsCount, subGroups, hoursPerWeek } of subject.groups) {
          const groupDB =
            (await this.groupService.findOne({
              name,
            })) ||
            (await this.groupService.create({
              name,
              subGroupsCount,
            }))

          await this.subjectHoursService.findOneOrCreateSubjectHours({
            groupId: groupDB.id,
            teacherToSubjectId: teacherToSubjectDB.id,
            semester: subject.semester,
            lectureHoursPerWeek: hoursPerWeek.lecture,
            practiceHoursPerWeek: hoursPerWeek.practice,
            laboratoryHoursPerWeek: hoursPerWeek.laboratory,
          })

          for (let subGroupIndex = 0; subGroupIndex < subGroups.length; subGroupIndex++) {
            const subGroup = subGroups[subGroupIndex]

            for (const { lessonName, lessonNumber, weekType, weekDay } of subGroup) {
              const subjectType = this.excelSubjectService.getTypeOfSubject(lessonName)
              const { auditorium, campus } =
                this.excelSubjectService.getAuditoriumAndCampus(lessonName)

              const timetableDto: CreateTimetableDto = {
                groupId: groupDB.id,
                teacherToSubjectId: teacherToSubjectDB.id,
                course: subject.course,
                semester: subject.semester,
                subGroupNum: (subGroupIndex + 1) as SubGroupNumber,
                hoursPerWeek: hoursPerWeek[subjectType],
                hoursPerSemester: subject.hoursPerSemester?.[subjectType],
                campus,
                weekDay,
                weekType,
                auditorium,
                subjectType,
                lessonNumber,
              }

              await this.timetableService.create(timetableDto)
            }
          }
        }
      }
    }
  }
}
