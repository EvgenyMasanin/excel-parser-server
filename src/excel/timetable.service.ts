import { Injectable } from '@nestjs/common'
import { ExcelHelperService } from './excel-helper.service'
import {
  CourseNum,
  DayOfWeek,
  ITable,
  ITableRow,
  Lessons,
  lessons,
  Merge,
  Merges,
  Semester,
  Timetable,
  WeekDays,
  weekDays,
  WeekType,
} from './types'

@Injectable()
export class TimetableService {
  constructor(private readonly exlHlpSrv: ExcelHelperService) {}

  private merges: Merges
  private table: ITable

  private isTableEnd = false

  private weekType: WeekType = 'down'

  private dayOfWeek: DayOfWeek
  private dayOfWeekMerge: Merge

  private groupNames: string[] = []
  private groupNamesMerge: Merges = []

  private currentJointLesson: string
  private currentJointLessonMerge: Merge
  private isCurrentJointLessonPerWeek = false

  private timetable: Timetable = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  }

  private setDefaultProperties() {
    this.merges = undefined
    this.table = undefined
    this.isTableEnd = false
    this.weekType = 'down'
    this.dayOfWeek = undefined
    this.dayOfWeekMerge = undefined
    this.groupNames = []
    this.groupNamesMerge = []
    this.currentJointLesson = undefined
    this.currentJointLessonMerge = undefined
    this.isCurrentJointLessonPerWeek = undefined
    this.timetable = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    }
  }

  getTimetable(table: ITable, merges: Merges) {
    this.merges = merges
    this.table = table

    const Semester: Semester = 'first'
    const Course: CourseNum = 4

    const lessonsMerges = this.merges.filter(
      (merge) => +merge.s.c === this.exlHlpSrv.getNumOfColumn('B')
    )

    this.setGroups()

    Object.entries(this.table).forEach(([rowNumber, rowContent]) => {
      this.setDayOfWeek(rowNumber, rowContent)

      if (this.isTableEnd) return
      if (!this.dayOfWeek) return

      this.toggleWeekType()

      this.groupNames.forEach((group, index) => {
        const lessonMerges = lessonsMerges.find(
          (merge) =>
            merge.s.r === +rowNumber - 1 || merge.e.r === +rowNumber - 1
        )

        if (!lessonMerges) {
          this.weekType = 'down'
          return
        }

        const lessonNumber = lessons[
          this.table[lessonMerges.s.r + 1].B
        ] as keyof typeof Lessons

        if (this.isOneSubGroup(index)) {
          const columnName = this.exlHlpSrv.getNameOfColumn(
            this.groupNamesMerge[index].s.c
          )

          this.setCurrentJointLesson(rowNumber, rowContent, columnName, index)

          const { lessonName, isLessonPerWeek } = this.setLessonName(
            rowNumber,
            rowContent,
            columnName
          )

          if (!this.hasLessonData(lessonNumber)) {
            this.timetable[WeekDays[this.dayOfWeek]].push({
              [group]: [
                {
                  up: lessonName,
                  down: this.isCurrentJointLessonPerWeek
                    ? lessonName
                    : isLessonPerWeek
                    ? lessonName
                    : null,
                  semester: Semester,
                  course: Course,
                },
              ],
            })
          } else if (
            !this.timetable[WeekDays[this.dayOfWeek]][Lessons[lessonNumber]][
              group
            ]
          ) {
            this.timetable[WeekDays[this.dayOfWeek]][Lessons[lessonNumber]][
              group
            ] = [
              {
                up: lessonName,
                down: this.isCurrentJointLessonPerWeek
                  ? lessonName
                  : isLessonPerWeek
                  ? lessonName
                  : null,
                semester: Semester,
                course: Course,
              },
            ]
          } else {
            const groupData =
              this.timetable[WeekDays[this.dayOfWeek]][Lessons[lessonNumber]][
                group
              ][0]
            if (!groupData.down) groupData.down = lessonName
          }
        } else {
          const columnName1 = this.exlHlpSrv.getNameOfColumn(
            this.groupNamesMerge[index].s.c
          )
          const columnName2 = this.exlHlpSrv.getNameOfColumn(
            this.groupNamesMerge[index].e.c
          )

          this.setCurrentJointLesson(rowNumber, rowContent, columnName1, index)
          console.log(this.currentJointLesson)

          const { lessonName: lessonName1, isLessonPerWeek: isLessonPerWeek1 } =
            this.setLessonName(rowNumber, rowContent, columnName1)
          const { lessonName: lessonName2, isLessonPerWeek: isLessonPerWeek2 } =
            this.setLessonName(rowNumber, rowContent, columnName2)

          if (!this.hasLessonData(lessonNumber)) {
            this.timetable[WeekDays[this.dayOfWeek]].push({
              [group]: [
                {
                  up: lessonName1,
                  down: this.isCurrentJointLessonPerWeek
                    ? lessonName1
                    : isLessonPerWeek1
                    ? lessonName1
                    : null,
                  semester: Semester,
                  course: Course,
                },
                {
                  up: lessonName2,
                  down: this.isCurrentJointLessonPerWeek
                    ? lessonName2
                    : isLessonPerWeek2
                    ? lessonName2
                    : null,
                  semester: Semester,
                  course: Course,
                },
              ],
            })
          } else if (!this.hasGroupData(lessonNumber, group)) {
            this.timetable[WeekDays[this.dayOfWeek]][Lessons[lessonNumber]][
              group
            ] = [
              {
                up: lessonName1,
                down: this.isCurrentJointLessonPerWeek
                  ? lessonName1
                  : isLessonPerWeek1
                  ? lessonName1
                  : null,
                semester: Semester,
                course: Course,
              },
              {
                up: lessonName2,
                down: this.isCurrentJointLessonPerWeek
                  ? lessonName2
                  : isLessonPerWeek2
                  ? lessonName2
                  : null,
                semester: Semester,
                course: Course,
              },
            ]
          } else {
            const groupData =
              this.timetable[WeekDays[this.dayOfWeek]][Lessons[lessonNumber]][
                group
              ]

            if (!groupData[0].down) groupData[0].down = lessonName1
            if (!groupData[1].down) groupData[1].down = lessonName2
          }
        }
      })
    })

    const timetable = this.timetable
    this.setDefaultProperties()
    return timetable
  }

  private toggleWeekType() {
    this.weekType = this.weekType === 'up' ? 'down' : 'up'
  }

  private setLessonName(
    rowNumber: string,
    rowContent: ITableRow,
    columnName: string
  ) {
    const ceilData = rowContent[columnName]

    if (this.currentJointLesson)
      return {
        lessonName: this.currentJointLesson,
        isLessonPerWeek: this.isCurrentJointLessonPerWeek,
      }

    if (ceilData) {
      const merge = this.merges.find(
        (merge) =>
          merge.s.c === this.exlHlpSrv.getNumOfColumn(columnName) &&
          merge.s.r === +rowNumber - 1
      )
      return {
        lessonName: ceilData,
        isLessonPerWeek: this.isLessonPerWeek(merge),
      }
    }

    return { lessonName: null, isLessonPerWeek: false }
  }

  private setDayOfWeek(rowNumber: string, rowContent: ITableRow) {
    if (this.dayOfWeekMerge?.e.r > +rowNumber - 1) return

    if (weekDays.includes(rowContent.A?.toString() as DayOfWeek)) {
      this.dayOfWeekMerge = this.merges.find(
        (merge) => merge.s.c === 0 && merge.s.r === +rowNumber - 1
      )
      this.dayOfWeek = rowContent.A.toString() as DayOfWeek
    } else if (this.dayOfWeekMerge?.e.r < +rowNumber - 1) {
      this.isTableEnd = true
    }
  }

  private setGroups() {
    const rowNum = 7

    Object.entries(this.table[rowNum]).forEach(([columnName, groupName]) => {
      const column = this.exlHlpSrv.getNumOfColumn(columnName)

      const defaultMerge = {
        s: { c: column, r: rowNum - 1 },
        e: { c: column, r: rowNum - 1 },
      }

      const merge = this.merges.find(
        (merge) => merge.s.c === column && merge.s.r === 6
      )

      this.groupNames.push(groupName)
      this.groupNamesMerge.push(merge || defaultMerge)
    })
  }

  private setCurrentJointLesson(
    rowNumber: string,
    rowContent: ITableRow,
    columnName: string,
    groupNumber: number
  ) {
    if (
      groupNumber === 0 ||
      this.currentJointLessonMerge?.e.c <
        this.exlHlpSrv.getNumOfColumn(columnName)
    ) {
      this.currentJointLesson = undefined
      this.isCurrentJointLessonPerWeek = false
    }
    const merge = this.merges.find(
      (merge) =>
        merge.s.c === this.exlHlpSrv.getNumOfColumn(columnName) &&
        merge.s.r === +rowNumber - 1
    )

    if (this.exlHlpSrv.getNumOfColumn(columnName) <= merge?.e.c) {
      if (merge?.s.c !== merge?.e.c) {
        this.currentJointLesson = rowContent[columnName]
        this.currentJointLessonMerge = merge
        if (this.isLessonPerWeek(this.currentJointLessonMerge))
          this.isCurrentJointLessonPerWeek = true
      }
    }
  }

  private hasGroupData(lessonNumber: keyof typeof Lessons, group: string) {
    return this.timetable[WeekDays[this.dayOfWeek]][Lessons[lessonNumber]][
      group
    ]
  }

  private hasLessonData(lessonNumber: keyof typeof Lessons) {
    return this.timetable[WeekDays[this.dayOfWeek]][Lessons[lessonNumber]]
  }

  private isOneSubGroup(groupNumber: number) {
    return (
      this.groupNamesMerge[groupNumber].s.c ===
      this.groupNamesMerge[groupNumber].e.c
    )
  }

  private isLessonPerWeek(lessonMerge: Merge) {
    return lessonMerge?.s.r !== lessonMerge?.e.r
  }
}