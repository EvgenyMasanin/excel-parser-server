import { PartialType } from '@nestjs/swagger'
import { createUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(createUserDto) {
  rolesId: number[]
}
