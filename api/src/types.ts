import type { Response, Request } from 'express'

export type TCreateUserInput = {
  first_name: string
  last_name: string
  email: string
  phone?: string
  password: string
}

export type TUpdateUserInput = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
}

export type TUser = {
  id: number
  active: boolean
  created_at: Date
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  password: string
  token: string
  token_expiration: Date
}

export type TPrivateUser = Omit<TUser, 'active' | 'password' | 'token' | 'token_expiration'>

export type TPublicUser = Omit<TPrivateUser, 'active' | 'password' | 'token' | 'token_expiration' | 'email' | 'phone'>

export type TPost = {
  id: number
  created_at: Date
  title: string
  content: string
  owner_id: number
}

export type TContext = {
  req: Request,
  res: Response
}

