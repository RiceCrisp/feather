import type { TPost } from '~/types'
import { resolvers as createPostReducers } from './create-post'
import { resolvers as getPostReducers } from './get-post'
import { resolvers as getPostsReducers } from './get-posts'

export const types = `
  input UpdatePostInput {
    title: String!
    content: String!
  }

  type Post {
    id: ID!
    created_at: String!
    title: String!
    content: String!
    owner: User!
  }
`

export const queries = `
  getPosts(
    title: String
    content: String
    owner_id: ID
  ): [Post]!

  getPost(
    id: Int!
  ): Post

  updatePost(
    id: ID!
    input: UpdatePostInput!
  ): Post!
`

export const mutations = `
  createPost(
    title: String!
    content: String!
  ): Post!
`

export const postFields: Array<keyof TPost> = [
  'id',
  'created_at',
  'title',
  'content',
  'owner_id'
]

export const resolvers = [
  createPostReducers,
  getPostReducers,
  getPostsReducers
]

// export const reducers = {
//   getPosts: async (input: Partial<Pick<TPost, 'title' | 'content' | 'owner_id'>>) => {
//     try {
//       const rows = await knex.transaction((trx) => {
//         return trx<TPost>('notes')
//           .select(postFields)
//           .where((builder) => {
//             if (typeof input.title === 'string' && input.title) {
//               void builder.whereILike('title', `%${input.title}%`)
//             }
//             if (typeof input.content === 'string' && input.content) {
//               void builder.whereILike('content', `%${input.content}%`)
//             }
//             if (typeof input.owner_id === 'string' && input.owner_id) {
//               void builder.where({ owner_id: input.owner_id })
//             }
//           })
//       })
//       return rows
//     }
//     catch (err) {
//       const error = err as Error
//       throw new Error(error.message)
//     }
//   },
//   getPost: async (input: Partial<Pick<TPost, 'id'>>) => {
//     try {
//       const row = await knex.transaction((trx) => {
//         return trx<TPost>('posts')
//           .select(postFields)
//           .where({ id: input.id })
//           .first()
//       })
//       return row
//     }
//     catch (err) {
//       const error = err as Error
//       throw new Error(error.message)
//     }
//   },
//   createPost: async ({ input }: { input: ICreateUserInput }) => {
//     const row = await knex.transaction((trx) => {
//       return trx<TPost>('users')
//         .insert({
//           title: input.first_name,
//           content: input.last_name
//         })
//         .returning(postFields)
//     })
//     return row[0]
//   },
//   // updateNote: async ({ id, input }: { id: number, input: IUpdateUserInput }) => {
//   //   const rows = await knex.transaction((trx) => {
//   //     return trx<TNote>('users')
//   //       .update({
//   //         first_name: input.first_name,
//   //         last_name: input.last_name,
//   //         email: input.email,
//   //         phone: input.phone
//   //       })
//   //       .where({ id })
//   //       .returning(privateUserFields)
//   //   })
//   //   if (!rows.length) {
//   //     throw new Error('User does not exist')
//   //   }
//   //   return rows[0]
//   // },
//   // deleteNote: async ({ id }: { id: number }) => {
//   //   const rows = await knex.transaction((trx) => {
//   //     return trx<TNote>('users')
//   //       .where({ id })
//   //       .delete()
//   //       .returning(privateUserFields)
//   //   })
//   //   if (!rows.length) {
//   //     throw new Error('User does not exist')
//   //   }
//   //   return rows
//   // }
// }
