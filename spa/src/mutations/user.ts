import type { TUser } from '@/src/types'
import { APIError, graphqlRequest } from '@/src/utils'

type TSignupArgs = {
  email: string
  password: string
}

export async function signup(args: TSignupArgs): Promise<TUser> {
  const res = await graphqlRequest<{ createUser: TUser }>(`mutation {
    createUser(
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
  return res.createUser
}

type TActivateArgs = {
  email: string
  token: string
}

export async function activate(args: TActivateArgs): Promise<TUser> {
  const res = await graphqlRequest<{ activateUser: TUser }>(`mutation {
    activateUser(
      email: "${args.email}"
      token: "${args.token}"
    ) {
      ... on PrivateUser {
        email
      }
    }
  }`)
  if ('error' in res) {
    throw new APIError(res.error)
  }
  return res.activateUser
}

type TUpdatePasswordArgs = {
  email: string
  token: string
  password: string
}

export async function updatePassword(args: TUpdatePasswordArgs): Promise<boolean> {
  const res = await graphqlRequest<{ updatePassword: boolean }>(`mutation {
    updatePassword(
      email: "${args.email}"
      token: "${args.token}"
      password: "${args.password}"
    ) {
      ... on PrivateUser {
        email
      }
    }
  }`)
  if ('error' in res) {
    throw new APIError(res.error)
  }
  if (!res.updatePassword) {
    throw new APIError()
  }
  return res.updatePassword
}

type TUpdateUserArgs = {
  id: string
  input: {
    first_name?: string
    last_name?: string
  }
}

export async function updateUser(args: TUpdateUserArgs): Promise<TUser> {
  const res = await graphqlRequest<{ updateUser: TUser }>(`mutation {
    updateUser(
      id: ${args.id}
      input: {
        first_name: "${args.input.first_name ?? ''}"
        last_name: "${args.input.last_name ?? ''}"
      }
    ) {
      ... on PrivateUser {
        first_name
        last_name
      }
    }
  }`)
  if ('error' in res) {
    throw new APIError(res.error)
  }
  return res.updateUser
}
