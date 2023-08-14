import { z } from 'zod'
import * as crypto from 'crypto'

import type { TUser } from '~/types'
import { knex } from '~/db'
import { sendActivationEmail, sendResetPasswordEmail } from '~/mail'
import { validateInput } from '~/utils'

enum EmailType {
  'ACTIVATE' = 'ACTIVATE',
  'RESETPASSWORD' = 'RESETPASSWORD'
}
type TArgs = Pick<TUser, 'email'> & { type: EmailType }

export const resolvers = {
  Mutation: {
    sendEmail: async (_: any, args: TArgs) => {
      // Field validation
      const schema = z.object({
        type: z
          .nativeEnum(EmailType),
        email: z
          .string()
          .trim()
          .min(1, { message: 'Required' })
          .email(),
      })
      const { type, email } = validateInput(schema, args)

      const now = new Date().getTime()
      const token = crypto.randomBytes(64).toString('hex')

      // Send activation email
      if (type === 'ACTIVATE') {
        const oneDay = now + (24 * 60 * 60 * 1000)
        const rows = await knex.transaction((trx) => {
          return trx<TUser>('users')
            .update({
              token,
              token_expiration: new Date(oneDay)
            })
            .where({ email })
            .returning(['id', 'email', 'token'])
        })
        if (rows.length) {
          const { id, email, token } = rows[0]
          await sendActivationEmail({
            id,
            email,
            token
          })
          return true
        }
      }

      // Send reset password email
      if (type === 'RESETPASSWORD') {
        const oneHour = now + (60 * 60 * 1000)
        const rows = await knex.transaction((trx) => {
          return trx<TUser>('users')
            .update({
              token,
              token_expiration: new Date(oneHour)
            })
            .where({ email })
            .returning(['id', 'email', 'token'])
        })
        if (rows.length) {
          const { id, email, token } = rows[0]
          await sendResetPasswordEmail({
            id,
            email,
            token
          })
        }
        return true
      }

      // Something failed
      return false
    }
  }
}
