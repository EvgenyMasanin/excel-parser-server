import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTimetableDto } from './dto/create-timetable.dto'
import { UpdateTimetableDto } from './dto/update-timetable.dto'
import { Timetable } from './entities/timetable.entity'

@Injectable()
export class TimetableService {
  create(createTimetableDto: CreateTimetableDto) {
    return 'This action adds a new timetable'
  }

  findAll() {
    return `This action returns all timetable`
  }

  findOne(id: number) {
    return `This action returns a #${id} timetable`
  }

  update(id: number, updateTimetableDto: UpdateTimetableDto) {
    return `This action updates a #${id} timetable`
  }

  remove(id: number) {
    return `This action removes a #${id} timetable`
  }
}
