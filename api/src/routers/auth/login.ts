import { GraphQLError } from 'graphql'
import { z } from 'zod'
import bcrypt from 'bcrypt'

import type { TContext, TUser } from '~/types'
import { knex } from '~/db'
import { validateInput } from '~/utils'

type TArgs = Pick<TUser, 'email' | 'password'>

export const resolvers = {
  Mutation: {
    login: async (_: any, args: TArgs, { req }: TContext) => {
      // Field validation
      const schema = z.object({
        email: z
          .string()
          .trim()
          .min(1, { message: 'Required' })
          .email(),
        password: z
          .string()
          .trim()
          .min(1, { message: 'Required' })
      })
      const { email, password } = validateInput(schema, args)

      // Check email
      const rows = await knex.transaction((trx) => {
        return trx<TUser>('users')
          .select('*')
          .where({ email })
      })
      if (!rows.length) {
        const errors = new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            path: [],
            message: 'Invalid email or password'
          }
        ]).flatten()
        throw new GraphQLError('Invalid input', {
          extensions: {
            code: 'FORM_FIELD_ERROR',
            ...errors
          }
        })
      }

      // Check password
      const foundUser = rows[0]
      const match = await bcrypt.compare(password, foundUser.password)
      if (!match) {
        const errors = new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            path: [],
            message: 'Invalid email or password'
          }
        ]).flatten()
        throw new GraphQLError('Invalid input', {
          extensions: {
            code: 'FORM_FIELD_ERROR',
            ...errors
          }
        })
      }

      // Check active
      if (!foundUser.active) {
        const errors = new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            path: [],
            message: 'Inactive account',
            params: {
              id: foundUser.id
            }
          }
        ]).flatten()
        throw new GraphQLError('Invalid input', {
          extensions: {
            code: 'INACTIVE_USER',
            ...errors
          }
        })
      }

      // Return user
      const output = foundUser as Partial<TUser>
      delete output.password
      delete output.token
      delete output.token_expiration
      req.session.userId = output.id

      return output
    }
  }
}
