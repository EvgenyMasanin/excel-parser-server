import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { JwtPayload, JwtStrategies } from '../types'

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, JwtStrategies.JWT_REFRESH) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.PRIVATE_KEY,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: JwtPayload) {
    const [, refreshToken] = req.headers.authorization.split(' ')
    return {
      ...payload,
      refreshToken,
    }
  }
}
