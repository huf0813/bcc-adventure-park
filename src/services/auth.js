const crypto = require('crypto')
const session = require('../utils/session')
const db = require('../utils/db')

const TOKEN_LIFESPAN = 86400000

async function generateToken(userId){
  const token = (await crypto.randomBytes(48)).toString('base64')
  const userFromDb = await db('users').where({ id: userId }).select(["email", "level"]).first()
  const expiresAt = Date.now() + TOKEN_LIFESPAN
  await session.set(token, { id: userId, ...userFromDb }, TOKEN_LIFESPAN)
  await session.set("token_" + userId, token, TOKEN_LIFESPAN)
  return { token: token, expiresAt: expiresAt }
}

async function invalidateToken(token){
  try {
    const userId = (await session.get(token)).id
    await session.delete(token)
    await session.delete("token_" + userId)
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
