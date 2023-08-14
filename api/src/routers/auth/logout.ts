import { SESSION_COOKIE_NAME } from '~/env'

import type { TContext } from '~/types'

export const resolvers = {
  Mutation: {
    logout: async (_: any, _args: undefined, { res, req }: TContext) => {
      await new Promise<void>((resolve) => {
        req.session.destroy(() => {
          resolve()
        })
      })
      res.clearCookie(SESSION_COOKIE_NAME, { path: '/' })
      return true
    }
  }
}
