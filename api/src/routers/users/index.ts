import type { TUser } from '~/types'
import { resolvers as activateUserReducers } from './activate-user'
import { resolvers as updatePasswordReducers } from './update-password'
import { resolvers as createUserReducers } from './create-user'
import { resolvers as getUserReducers } from './get-user'
import { resolvers as getUsersReducers } from './get-users'
import { resolvers as updateUserReducers } from './update-user'
import { resolvers as deleteUserReducers } from './delete-user'

export const types = `
  input UpdateUserInput {
    first_name: String
    last_name: String
    phone: String
  }

  interface User {
    id: ID!
    created_at: String!
    first_name: String
    last_name: String
  }

  type PrivateUser implements User {
    id: ID!
    created_at: String!
    first_name: String
    last_name: String
    email: String!
    phone: String
  }

  type PublicUser implements User {
    id: ID!
    created_at: String!
    first_name: String
    last_name: String
  }
`

export const queries = `
  getUsers(
    first_name: String
    last_name: String
  ): [User]!

  getUser(
    id: ID!
  ): User
`

export const mutations = `
  activateUser(
    email: String!
    token: String!
  ): PrivateUser!

  createUser(
    email: String!
    password: String!
  ): PrivateUser!

  updatePassword(
    email: String!
    token: String!
    password: String!
  ): PrivateUser!
  
  updateUser(
    id: ID!
    input: UpdateUserInput!
  ): PrivateUser!

  deleteUser(
    id: ID!
  ): PrivateUser!
`

export const privateFields: Array<keyof TUser> = [
  'id',
  'created_at',
  'first_name',
  'last_name',
  'email',
  'phone'
]

export const publicFields: Array<keyof TUser> = [
  'id',
  'created_at',
  'first_name',
  'last_name'
]

const resolveType = {
  User: {
    __resolveType: (obj: TUser) => {
      if (obj.email) {
        return 'PrivateUser'
      }
      return 'PublicUser'
    }
  }
}

export const resolvers = [
  resolveType,
  activateUserReducers,
  updatePasswordReducers,
  createUserReducers,
  getUserReducers,
  getUsersReducers,
  updateUserReducers,
  deleteUserReducers
]
