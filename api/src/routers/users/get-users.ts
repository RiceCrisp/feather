import { z } from 'zod'

import { knex } from '~/db'
import type { TUser } from '~/types'
import { publicFields } from './index'
import { validateInput } from '~/utils'

type TArgs = Partial<Pick<TUser, 'first_name' | 'last_name'>>

export const resolvers = {
  Query: {
    getUsers: async (_: any, args: TArgs) => {
      // Field validation
      const schema = z.object({
        first_name: z
          .string(),
        last_name: z
          .string()
      })
      const { first_name: firstName, last_name: lastName } = validateInput(schema, args)

      // Find users
      const rows = await knex.transaction((trx) => {
        return trx<TUser>('users')
          .select(publicFields)
          .where((builder) => {
            if (typeof args.first_name === 'string' && firstName) {
              void builder.whereILike('first_name', `%${firstName}%`)
            }
            if (typeof args.last_name === 'string' && lastName) {
              void builder.whereILike('last_name', `%${lastName}%`)
            }
          })
      })

      // Return users array
      return rows
    }
  }
}
