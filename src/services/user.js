const bcrypt = require('bcrypt')
const db = require('../utils/db')

const LEVEL_VISITOR = "visitor"
const LEVEL_ADMIN = "admin"

async function addUser({ email, pass, name }){
  const hashedPass = await bcrypt.hash(pass, 10)
  return await db('users').insert({ email: email, name: name, pass: hashedPass, level: LEVEL_VISITOR })
}

async function getUserById(id){
  return await db('users').select(["id", "email", "name", "level", "balance"]).where({ id: id }).first()
}

module.exports = {
  LEVEL_VISITOR,
  LEVEL_ADMIN,
  addUser,
  getUserById
}
