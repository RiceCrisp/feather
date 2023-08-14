import { knex as knexPackage } from 'knex'

export const knex = knexPackage({
  client: 'pg',
  connection: process.env.DB_URI
})
