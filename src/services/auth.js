const bcrypt = require('bcrypt')
const db = require('../utils/db')

const LEVEL_VISITOR = "visitor"
const LEVEL_ADMIN = "admin"

async function addUser({ email, pass }){
  const hashedPass = await bcrypt.hash(pass, 10)
  await db('users').insert({ email: email, pass: hashedPass, level: LEVEL_VISITOR })
}

module.exports = {
  LEVEL_VISITOR,
  LEVEL_ADMIN,
  addUser
}