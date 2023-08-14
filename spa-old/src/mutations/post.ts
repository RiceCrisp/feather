import type { TPost } from '~/types'
import { APIError, graphqlRequest } from '~/utils'

type TCreatePostArgs = Pick<TPost, 'title' | 'content'>

export async function createPost(args: TCreatePostArgs): Promise<TPost> {
  const res = await graphqlRequest<{ createPost: TPost }>(`mutation {
    createPost(
      title: "${args.title}"
      content: "${args.content.replace(/\n/, '\\n')}"
    ) {
      id
      title
      content
    }
  }`)
  if ('error' in res) {
    throw new APIError(res.error)
  }
  return res.createPost
}

type TUpdatePostArgs = {
  id: string
  input: {
    first_name?: string
    last_name?: string
  }
}

export async function updatePost(args: TUpdatePostArgs): Promise<TPost> {
  const res = await graphqlRequest<{ updatePost: TPost }>(`mutation {
    updatePost(
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
  return res.updatePost
}
