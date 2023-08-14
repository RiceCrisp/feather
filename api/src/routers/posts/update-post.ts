import { GraphQLError } from 'graphql'
import { z } from 'zod'

import { postFields } from './index'
import { knex } from '~/db'
import type { TContext, TPost } from '~/types'
import { validateAuthentication, validateAuthorization, validateInput } from '~/utils'

type TArgs = Pick<TPost, 'id'> & {
  input: Pick<TPost, 'title' | 'content'>
}

export const resolvers = {
  Mutation: {
    updatePost: async (_: any, args: TArgs, { req }: TContext) => {
      // Authentication
      validateAuthentication(req)

      // Field validation
      const schema = z.object({
        id: z
          .number()
          .gt(0),
        input: z.object({
          title: z.
            string(),
          content: z.
            string()
        })
      })
      const { id, input } = validateInput(schema, args)

      // Check that user is owner of post
      const post = await knex.transaction((trx) => {
        return trx<TPost>('posts')
          .select(['owner_id'])
          .where({ id })
          .first()
      })
      validateAuthorization(req, post?.owner_id)

      // Update post
      const rows = await knex.transaction((trx) => {
        return trx<TPost>('posts')
          .update({
            title: input.title,
            content: input.content
          })
          .where({ id })
          .returning(postFields)
      })
      
      // Return updated post
      return rows[0]
    }
  }
}
