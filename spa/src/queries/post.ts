import type { TPost } from '@/src/types'
import { APIError, graphqlRequest } from '@/src/utils'

type TGetPostsArgs = {
  owner_id?: number
}

export async function getPosts(args: TGetPostsArgs): Promise<TPost[]> {
  let argsString = ''
  if (args.owner_id !== undefined) {
    argsString = `(owner_id: ${args.owner_id})`
  }
  const res = await graphqlRequest<{ getPosts: TPost[] }>(`query {
    getPosts${argsString} {
      id
      title
      created_at
      content
    }
  }`)
  if ('error' in res) {
    throw new APIError(res.error)
  }
  return res.getPosts
}

export async function getPost(id: number): Promise<TPost | null> {
  const res = await graphqlRequest<{ getPost: TPost | null }>(`query {
    getPost(id: ${id}) {
      id
      title
      created_at
      content
    }
  }`)
  if ('error' in res) {
    throw new APIError(res.error)
  }
  return res.getPost
}

