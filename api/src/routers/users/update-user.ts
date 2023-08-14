import { GraphQLError } from 'graphql'

import { privateFields } from './index'
import { knex } from '~/db'
import type { TContext, TUser } from '~/types'
import { validateAuthorization } from '~/utils'

type TArgs = Pick<TUser, 'id'> & {
  input: Partial<Pick<TUser, 'first_name' | 'last_name' | 'phone'>>
}

export const resolvers = {
  Mutation: {
    updateUser: async (_: any, args: TArgs, { req }: TContext) => {
      // Authorization
      validateAuthorization(req, args.id)

      // Update user if exists
      const { input } = args
      const rows = await knex.transaction((trx) => {
        return trx<TUser>('users')
          .update({
            first_name: input.first_name,
            last_name: input.last_name,
            phone: input.phone
          })
          .where({ id: Number(args.id) })
          .returning(privateFields)
      })
      if (!rows.length) {
        throw new GraphQLError('User does not exist')
      }
      
      // Return updated user
      return rows[0]
    }
  }
}
