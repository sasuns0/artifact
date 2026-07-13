import Type, { Static } from 'typebox';
import { User } from '.';

export const AuthResponse = Type.Object({
  status: Type.Number(),
})

export type AuthResponseType = Static<typeof AuthResponse>;

export type UserType = Static<typeof User>;

