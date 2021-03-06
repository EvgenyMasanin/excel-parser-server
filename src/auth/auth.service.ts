import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthDto, SignupDto } from './dto/auth.dto'
import { UserService } from 'src/user/user.service'
import { Tokens } from './types'
import { JwtService } from '@nestjs/jwt'
import { UserWithTokens } from './types/signup.types'
import { User } from 'src/user/entities/user.entity'
import { HashService } from 'src/hash/hash.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService
  ) {}

  async signup(
    { email, password, teacherId }: SignupDto,
    isAdmin?: boolean
  ): Promise<UserWithTokens> {
    if (await this.userService.findOneByEmail(email))
      throw new UnauthorizedException('This email is already used')

    if (isAdmin && (await this.isAdminExist()).isAdminExist) {
      throw new UnauthorizedException('Admin already exists')
    }

    const newUser = await this.userService.create(
      { email, password, teacherId: teacherId || null },
      isAdmin
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

    if (!user) throw new ForbiddenException('Access denied')

    const passwordMatches = await this.hashService.compareData(password, user.password)

    if (!passwordMatches) throw new ForbiddenException('Access denied')

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
  }

  async getMe(userId: number) {
    const user = await this.userService.findOne(userId)

    if (!user) throw new ForbiddenException('Access denied')

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

    if (!user || !user.refreshToken) throw new ForbiddenException('Access denied')

    const rtMatches = this.hashService.compareData(rt, user.refreshToken)
    if (!rtMatches) throw new ForbiddenException('Access denied')

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
    const hash = await this.hashService.hashData(rt)
    await this.userService.update(userId, { refreshToken: hash })
  }

  async isAdminExist() {
    return await this.userService.isAdminExist()
  }
}
