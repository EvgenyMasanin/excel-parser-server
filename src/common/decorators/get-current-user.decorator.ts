import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Tokens, TokensPayload } from 'src/auth/types'

export const GetCurrentUser = createParamDecorator(
  (data: (keyof TokensPayload | keyof Tokens) | undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest()
    if (!data) return request.user

    return request.user[data]
  }
)
