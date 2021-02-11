const crypto = require('crypto')
const session = require('../utils/session')
const db = require('../utils/db')
const userService = require('../services/user')

const TOKEN_LIFESPAN = 86400000

async function generateToken(userId){
  const token = (await crypto.randomBytes(48)).toString('base64')
  const userFromDb = await db('users').where({ id: userId }).select(["id", "email", "level"]).first()
  const expiresAt = Date.now() + TOKEN_LIFESPAN
  await session.set(token, { ...userFromDb }, TOKEN_LIFESPAN)
  return { token: token, expiresAt: expiresAt }
}

async function invalidateToken(token){
  try {
    await session.delete(token)
  } catch (e){

  } finally {
    return
  }
}

module.exports = {
  TOKEN_LIFESPAN,
  generateToken,
  invalidateToken
}