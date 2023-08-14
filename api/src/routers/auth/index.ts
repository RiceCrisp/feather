import { resolvers as loginReducers } from './login'
import { resolvers as logoutReducers } from './logout'
import { resolvers as meReducers } from './me'
import { resolvers as sendEmailReducers } from './send-email'
import { resolvers as verifyTokenReducers } from './verify-token'

export const types = `
  enum EmailType {
    ACTIVATE
    RESETPASSWORD
  }
`

export const queries = `
  me: User
`

export const mutations = `
  login(
    email: String!
    password: String!
  ): PrivateUser!

  logout: Boolean!

  sendEmail(
    email: String!
    type: EmailType!
  ): Boolean!

  verifyToken(
    email: String!
    token: String!
  ): Boolean!
`

export const resolvers = [
  loginReducers,
  logoutReducers,
  meReducers,
  sendEmailReducers,
  verifyTokenReducers
]
