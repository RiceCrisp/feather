import { z } from 'zod'
import { GraphQLError } from 'graphql'

import { knex } from '~/db'
import type { TContext, TPost } from '~/types'
import { postFields } from '.'
import { validateAuthentication, validateInput } from '~/utils'

type TArgs = Partial<Pick<TPost, 'title' | 'content'>>

export const resolvers = {
  Mutation: {
    createPost: async (_: any, args: TArgs, { req }: TContext) => {
      // Authentication
      validateAuthentication(req)

      // Field validation
      const schema = z.object({
        title: z
          .string()
          .trim()
          .min(1, { message: 'Required' }),
        content: z
          .string()
          .trim()
          .min(1, { message: 'Required' })
      })
      const { title, content } = validateInput(schema, args)

      // Create post in the db
      const rows = await knex.transaction((trx) => {
        return trx<TPost>('posts')
          .insert({
            title,
            content,
            owner_id: req.session.userId ?? 1
          })
          .returning(postFields)
      })

      // Return newly created post
      return rows[0]
    }
  }
}
