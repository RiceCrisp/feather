import type { TUser } from '~/types'
import { APIError, graphqlRequest } from '~/utils'

export async function getMe(): Promise<TUser> {
  const res = await graphqlRequest<{ me: TUser }>(`query {
    me {
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
  return res.me
}
