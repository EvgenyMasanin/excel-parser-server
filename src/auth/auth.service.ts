import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthDto, SignupDto } from './dto/auth.dto'
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service'
import { Tokens } from './types'
import { JwtService } from '@nestjs/jwt'
import { UserWithTokens } from './types/signup.types'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async signup(dto: SignupDto): Promise<UserWithTokens> {
    const hash = await this.hashData(dto.password)

    if (await this.userService.findOneByEmail(dto.email))
      throw new UnauthorizedException('This email is already used')

    const newUser = await this.userService.findOne(
      (
        await this.userService.create({
          email: dto.email,
          password: hash,
          teacherId: dto.teacherId,
        })
      ).id
    )

    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.roles.map((r) => r.name)
    )

    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken)

    return this.getUserWithTokens(newUser, tokens)
  }

  async signin({ email, password }: AuthDto): Promise<UserWithTokens> {
    const user = await this.userService.findOneByEmail(email)

    if (!user) throw new ForbiddenException('Access denied1')

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) throw new ForbiddenException('Access denied2')

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.roles.map((r) => r.name)
    )

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)

    return this.getUserWithTokens(user, tokens)
  }

  async logout(userId: number) {
    await this.userService.update(userId, {
      refreshToken: null,
    })
    return
  }

  async getMe(userId: number) {
    const user = await this.userService.findOne(userId)

    if (!user) throw new ForbiddenException('Access denied1')

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.roles.map((r) => r.name)
    )

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)

    return this.getUserWithTokens(user, tokens)
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.userService.findOne(userId)

    if (!user || !user.refreshToken) throw new ForbiddenException('Access denied3')

    const rtMatches = bcrypt.compare(rt, user.refreshToken)
    if (!rtMatches) throw new ForbiddenException('Access denied4')

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.roles.map((r) => r.name)
    )

    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)

    return tokens
  }

  async getTokens(userId: number, email: string, roles: string[]): Promise<Tokens> {
    const tokensPayload = {
      sub: userId,
      email,
      roles,
    }

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(tokensPayload, {
        secret: `access-${process.env.PRIVATE_KEY}`,
        // expiresIn: 60 * 15,
        expiresIn: 60,
      }),
      this.jwtService.signAsync(tokensPayload, {
        secret: `refresh-${process.env.PRIVATE_KEY}`,
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ])

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }

  getUserWithTokens({ id, email, teacher, roles }: User, tokens: Tokens): UserWithTokens {
    return {
      ...tokens,
      user: {
        id,
        email,
        teacher,
        roles,
      },
    }
  }

  async updateRefreshTokenHash(userId: number, rt: string) {
    const hash = await this.hashData(rt)
    await this.userService.update(userId, { refreshToken: hash })
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10)
  }
}
