const crypto = require('crypto')
const session = require('../utils/session')
const db = require('../utils/db')
const userService = require('../services/user')

async function generateToken(userId){
  const token = (await crypto.randomBytes(48)).toString('base64')
  const userFromDb = await db('users').where({ id: userId }).select(["id", "email", "level"]).first()
  session.set(token, { ...userFromDb })
  return token
}

module.exports = {
  generateToken
}