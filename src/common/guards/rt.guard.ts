import { AuthGuard } from '@nestjs/passport'
import { JwtStrategies } from '../types'

export class RtGuard extends AuthGuard(JwtStrategies.JWT_REFRESH) {
  constructor() {
    super()
  }
}
