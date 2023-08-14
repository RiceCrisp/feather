import { z } from 'zod'
import { GraphQLError } from 'graphql'
// import type { ApolloServerOptionsWithTypeDefs } from '@apollo/server'
// import type { IResolvers } from 'graphql-tools'
import bcrypt from 'bcrypt'

import { knex } from '~/db'
import type { TUser } from '~/types'
import { privateFields } from '.'
import { validateInput } from '~/utils'

type TArgs = Pick<TUser, 'email' | 'token' | 'password'>

export const resolvers = {
  Mutation: {
    updatePassword: async (_: any, args: TArgs) => {
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
          .min(1),
        password: z
          .string()
          .trim()
          .min(1, { message: 'Required' })
          .min(10)
          .regex(/^[a-zA-Z0-9!@#$%^&*_-]+$/, { message: 'Invalid characters' })
      })
      const { email, token, password } = validateInput(schema, args)

      // Update DB
      const now = new Date().getTime()
      const passwordHash = await bcrypt.hash(password, 10)
      const rows = await knex.transaction((trx) => {
        return trx<TUser>('users')
          .update({
            active: true,
            password: passwordHash,
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
