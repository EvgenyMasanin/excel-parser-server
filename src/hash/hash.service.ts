import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'

@Injectable()
export class HashService {
  hashData(data: string) {
    return hash(data, 10)
  }

  compareData(data: string, hash: string) {
    return compare(data, hash)
  }
}
