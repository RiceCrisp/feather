import { z } from 'zod'

import { knex } from '~/db'
import type { TContext, TUser } from '~/types'
import { privateFields, publicFields } from './index'
import { validateInput } from '~/utils'

type TArgs = Pick<TUser, 'id'>

export const resolvers = {
  Query: {
    getUser: async (_: any, args: TArgs, { req }: TContext) => {
      // Field validation
      const schema = z.object({
        id: z
          .number()
          .gt(0)
      })
      const { id } = validateInput(schema, args)

      // Get user
      const fields =
        req.session.userId === id
          ? privateFields
          : publicFields
      const row = await knex.transaction((trx) => {
        return trx<TUser>('users')
          .select(fields)
          .where({ id: args.id })
          .first()
      })

      // Return user or undefined
      return row
    }
  }
}
