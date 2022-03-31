import { User } from 'src/user/entities/user.entity'
import { Tokens } from './tokens.types'

export type UserWithTokens = Tokens & { user: Pick<User, 'id' | 'email' | 'teacher' | 'roles'> }
