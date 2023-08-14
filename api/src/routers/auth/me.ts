import { GraphQLError } from 'graphql'

import { knex } from '~/db'
import type { TContext, TUser } from '~/types'
import { privateFields } from '../users'

export const resolvers = {
  Query: {
    me: async (_: any, _args: undefined, { req }: TContext) => {
      // If undefined, user is not logged in
      if (req.session.userId === undefined) {
        return undefined
      }

      const rows = await knex.transaction((trx) => {
        return trx<TUser>('users')
          .where({ id: req.session.userId })
          .returning(privateFields)
      })
      if (!rows.length) {
        throw new GraphQLError('User does not exist')
      }
      
      // Return user
      return rows[0]
    }
  }
}
