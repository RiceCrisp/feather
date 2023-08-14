import { validateInput } from '~/utils'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { z } from 'zod'
import { GraphQLError } from 'graphql'

import { knex } from '~/db'
import type { TUser } from '~/types'
import { sendActivationEmail } from '~/mail'

type TArgs = Pick<TUser, 'email' | 'password'>

export const resolvers = {
  Mutation: {
    createUser: async (_: any, args: TArgs) => {
      // await new Promise(resolve => setTimeout(resolve, 1000))
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
          .regex(/^[a-zA-Z0-9!@#$%^&*_-]+$/, {
            message: 'Invalid characters'
          })
      })
      const { email, password } = validateInput(schema, args)

      // Check that email is not already in use
      const [exists] = await knex.transaction((trx) => {
        return trx<TUser>('users').count().where({ email })
      })
      const emailExists = Number(exists.count) > 0
      if (emailExists) {
        const errors = new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            path: ['email'],
            message: 'Email is already used by an account.'
          }
        ]).flatten()
        throw new GraphQLError('Invalid input', {
          extensions: {
            code: 'FORM_FIELD_ERROR',
            ...errors
          }
        })
      }

      // Create user in db
      const passwordHash = await bcrypt.hash(password, 10)
      const token = crypto.randomBytes(64).toString('hex')
      const now = new Date().getTime()
      const oneDay = now + 24 * 60 * 60 * 1000
      const rows = await knex.transaction((trx) => {
        return trx<TUser>('users')
          .insert({
            email,
            password: passwordHash,
            token,
            token_expiration: new Date(oneDay)
          })
          .returning(['id', 'email'])
      })

      // Send activation email
      await sendActivationEmail({
        id: rows[0].id,
        email,
        token
      })

      // Return newly created user (id, email)
      return rows[0]
    }
  }
}
