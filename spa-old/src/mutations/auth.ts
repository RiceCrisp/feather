import type { TUser } from '~/types'
import { APIError, graphqlRequest } from '~/utils'

type TLoginArgs = {
  email: string
  password: string
}

export async function login(args: TLoginArgs): Promise<TUser> {
  const res = await graphqlRequest<{ login: TUser }>(`mutation {
    login(
      email: "${args.email}"
      password: "${args.password}"
    ) {
      ... on PrivateUser {
        id
        email
        first_name
        last_name
      }
    }
  }`)
  if ('error' in res) {
    throw new APIError(res.error)
  }
  return res.login
}

type TSendEmailArgs = {
  type: 'ACTIVATE' | 'RESETPASSWORD'
  email: string
}

export async function sendEmail(args: TSendEmailArgs): Promise<boolean> {
  const res = await graphqlRequest<{ sendEmail: boolean }>(`mutation {
    sendEmail(
      type: ${args.type}
      email: "${args.email}"
    )
  }`)
  if ('error' in res) {
    throw new APIError(res.error)
  }
  if (!res.sendEmail) {
    throw new APIError()
  }
  return res.sendEmail
}

type TVerifyTokenArgs = {
  email: string
  token: string
}

export async function verifyToken(args: TVerifyTokenArgs): Promise<boolean> {
  const res = await graphqlRequest<{ verifyToken: boolean }>(`mutation {
    verifyToken(
      email: "${args.email}"
      token: "${args.token}"
    )
  }`)
  if ('error' in res) {
    throw new APIError(res.error)
  }
  if (!res.verifyToken) {
    throw new APIError()
  }
  return res.verifyToken
}

export async function logout(): Promise<TUser> {
  const res = await graphqlRequest<{ login: TUser }>(`mutation {
    logout
  }`)
  if ('error' in res) {
    throw new APIError(res.error)
  }
  return res.login
}
