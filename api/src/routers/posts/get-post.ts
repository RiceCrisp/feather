import { z } from 'zod'

import { knex } from '~/db'
import type { TContext, TPost } from '~/types'
import { postFields } from '.'
import { validateInput } from '~/utils'

type TArgs = Pick<TPost, 'id'>

export const resolvers = {
  Query: {
    getPost: async (_: any, args: TArgs, { req }: TContext) => {
      // Field validation
      const schema = z.object({
        id: z
          .number()
          .gt(0)
      })
      const { id } = validateInput(schema, args)

      // Get post
      const row = await knex.transaction((trx) => {
        return trx<TPost>('posts')
          .select(postFields)
          .where({ id })
          .first()
      })

      // Return user or undefined
      return row
    }
  }
}
