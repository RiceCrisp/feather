import { GraphQLError } from 'graphql'

import { privateFields } from './index'
import { knex } from '~/db'
import type { TContext, TUser } from '~/types'
import { validateAuthorization } from '~/utils'

type TArgs = Pick<TUser, 'id'>

export const resolvers = {
  Mutation: {
    deleteUser: async (_: any, args: TArgs, { req }: TContext) => {
      // Authorization
      validateAuthorization(req, args.id)

      // Delete user if exists
      const rows = await knex.transaction((trx) => {
        return trx<TUser>('users')
          .delete()
          .where({ id: args.id })
          .returning(privateFields)
      })
      if (!rows.length) {
        throw new GraphQLError('User does not exist')
      }

      // Return deleted user
      return rows[0]
    }
  }
}
