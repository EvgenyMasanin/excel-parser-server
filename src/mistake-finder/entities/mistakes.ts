import { CountOfLessonsMistake } from './count-of-lessons-mistake'
import { MissingCampusOrAuditoriumMistake } from './missing-campus-or-auditorium-mistake'
import { SameAuditoriumMistake } from './same-auditorium-mistake'

export type Mistakes = {
  mistakesWithCountOfLessons: CountOfLessonsMistake[]
  missingCampusOrAuditorium: MissingCampusOrAuditoriumMistake[]
  sameAuditorium: SameAuditoriumMistake[]
}
