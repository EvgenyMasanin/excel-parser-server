export class AuthDto {
  email: string
  password: string
}

export class SignupDto extends AuthDto {
  teacherId: number
}
