const knexStringCase = require('knex-stringcase')
const knex = require('knex')(knexStringCase({
  client: 'sqlite3',
  connection: {
    filename: process.env.NODE_ENV == 'test' ? "./test.sqlite3" : "./db.sqlite3",
  },
  useNullAsDefault: true
}))

module.exports = knex
