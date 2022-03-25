import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { JwtStrategies } from '../types'

@Injectable()
export class AtGuard extends AuthGuard(JwtStrategies.JWT) {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])
    
    if (isPublic) return true

    return super.canActivate(context)
  }
}
