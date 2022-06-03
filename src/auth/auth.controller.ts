import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators'
import { RtGuard } from './../common/guards/rt.guard'
import { AuthDto, SignupDto } from './dto/auth.dto'
import { RoleService } from 'src/role/role.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService
  ) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto)
  }

  @Public()
  @Post('signup-admin')
  @HttpCode(HttpStatus.CREATED)
  async signupAdmin(@Body() dto: SignupDto) {
    await this.roleService.generateBasicRoles()
    return await this.authService.signup(dto, true)
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto) {
    return await this.authService.signin(dto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number) {
    return await this.authService.logout(userId)
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ) {
    return await this.authService.refreshTokens(userId, refreshToken)
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@GetCurrentUserId() userId: number) {
    return await this.authService.getMe(userId)
  }

  @Public()
  @Get('is-admin-exist')
  async isAdminExist() {
    return await this.authService.isAdminExist()
  }
}
