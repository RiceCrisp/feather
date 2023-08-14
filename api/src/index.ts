import express from 'express'
import type { Request } from 'express'
import cors from 'cors'
import session from 'express-session'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'

import { PORT, SESSION_COOKIE_NAME, SESSION_SECRET } from '~/env'
import { schema, resolvers } from '~/routers'

declare module 'express-session' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface SessionData {
    userId: number
  }
}

async function initServer(): Promise<void> {
  const app = express()

  app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true
  }))

  app.use(session({
    name: SESSION_COOKIE_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // sameSite: 'none',
      httpOnly: true,
      secure: false, // This will only work if you have https enabled!
      maxAge: 60 * 60 * 1000 // 60 * 1000 = minute
    } 
  }))

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  const server = new ApolloServer<{ req: Request }>({
    typeDefs: schema,
    resolvers
  })

  await server.start()

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res })
    })
  )

  app.listen(PORT, () => {
    console.log(`Express server started at http://localhost:${PORT}`);
  })
}

void initServer()
