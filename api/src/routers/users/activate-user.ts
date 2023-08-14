import { z } from 'zod'
import { GraphQLError } from 'graphql'

import { knex } from '~/db'
import type { TUser } from '~/types'
import { privateFields } from '.'
import { validateInput } from '~/utils'

type TArgs = Pick<TUser, 'email' | 'token'>

export const resolvers = {
  Mutation: {
    activateUser: async (_: any, args: TArgs) => {
      // Field validation
      const schema = z.object({
        email: z
          .string()
          .trim()
          .min(1, { message: 'Required' })
          .email(),
        token: z
          .string()
          .trim()
          .min(1)
      })
      const { email, token } = validateInput(schema, args)

      // Update DB
      const now = new Date().getTime()
      const rows = await knex.transaction((trx) => {
        return trx<TUser>('users')
          .update({
            active: true,
            token_expiration: new Date(now)
          })
          .where({ email, token })
          .andWhere('token_expiration', '>=', new Date(now))
          .returning(privateFields)
      })

      // Throw error if row not found
      if (!rows.length) {
        throw new GraphQLError('Invalid input', {
          extensions: {
            code: 'LINK_EXPIRED'
          }
        })
      }

      // Return user
      return rows[0]
    }
  }
}
