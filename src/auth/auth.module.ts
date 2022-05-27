import { RtJwtStrategy, AtJwtStrategy } from '../common/strategies'
import { UserModule } from './../user/user.module'
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { HashModule } from 'src/hash/hash.module'

@Module({
  controllers: [AuthController],
  providers: [AuthService, RtJwtStrategy, AtJwtStrategy],
  imports: [UserModule, HashModule, JwtModule.register({})],
})
export class AuthModule {}
