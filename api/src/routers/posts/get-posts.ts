import { z } from 'zod'

import { knex } from '~/db'
import type { TPost } from '~/types'
import { postFields } from './index'
import { validateInput } from '~/utils'

type TArgs = Partial<Pick<TPost, 'title' | 'content' | 'owner_id'>>

export const resolvers = {
  Query: {
    getPosts: async (_: any, args: TArgs) => {
      // Field validation
      const schema = z.object({
        title: z
          .string()
          .optional(),
        content: z
          .string()
          .optional(),
        owner_id: z
          .number()
          .optional(),
      })
      const { title, content, owner_id: ownerId } = validateInput(schema, args)

      // Find users
      const rows = await knex.transaction((trx) => {
        return trx<TPost>('posts')
          .select(postFields)
          .where((builder) => {
            if (title !== undefined) {
              void builder.whereILike('title', `%${title}%`)
            }
            if (content !== undefined) {
              void builder.whereILike('last_name', `%${content}%`)
            }
            if (ownerId !== undefined) {
              void builder.where('owner_id', ownerId)
            }
          })
      })

      // Return users array
      return rows
    }
  }
}
