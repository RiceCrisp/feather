import { buildSchema } from 'graphql'

import * as auth from './auth'
import * as users from './users'
import * as posts from './posts'

export const schema = buildSchema(`
  ${auth.types}
  ${users.types}
  ${posts.types}

  type Query {
    ${auth.queries}
    ${users.queries}
    ${posts.queries}
  }

  type Mutation {
    ${auth.mutations}
    ${users.mutations}
    ${posts.mutations}
  }
`)

export const resolvers = [
  ...auth.resolvers,
  ...users.resolvers,
  ...posts.resolvers
]
