import { z } from 'zod'

import { knex } from '~/db'
import type { TUser } from '~/types'
import { validateInput } from '~/utils'

type TArgs = Pick<TUser, 'id' | 'token'>

export const resolvers = {
  Mutation: {
    verifyToken: async (_: any, args: TArgs) => {
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

      // Validate token
      const now = new Date().getTime()
      const [exists] = await knex.transaction((trx) => {
        return trx<TUser>('users')
          .count()
          .where({ email, token })
          .andWhere('token_expiration', '>=', new Date(now))
      })
      const tokenValid = Number(exists.count) > 0
      return tokenValid
    }
  }
}
