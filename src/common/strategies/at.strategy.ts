import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload, JwtStrategies } from '../types'

@Injectable()
export class AtJwtStrategy extends PassportStrategy(Strategy, JwtStrategies.JWT) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.PRIVATE_KEY,
    })
  }

  validate(payload: JwtPayload) {
    return payload
  }
}
