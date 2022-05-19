import { SubGroupNumber, WeekDaysEN } from 'src/excel/types'
import { Group } from 'src/groups/entities/group.entity'
import { Subject } from 'src/subjects/entities/subject.entity'
import { Timetable } from '../entities/timetable.entity'

export type WeekTimetableGroup = Omit<Group, 'subGroupsCount'> & {
  subGroupNum: SubGroupNumber | 'all'
}

export type WeekTimetable = Omit<Timetable, 'group' | 'groupId' | 'subGroupNum'> & {
  groups: WeekTimetableGroup[]
} & { subject: Subject }

export type Week = Record<WeekDaysEN, WeekTimetable[]>
