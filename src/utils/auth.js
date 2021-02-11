const session = require('./session')
const db = require('./db')
const bcrypt = require('bcrypt')

const ERR_NO_TOKEN_MSG = "Please supply a bearer token"
const ERR_INVALID_TOKEN = "Invalid token"
const ERR_INVALID_EMAILPASS = "Invalid email and/or password"

async function verifyToken(req, rep){
  const bearerRaw = req.headers.authorization
  if(bearerRaw == null){
    throw new Error(ERR_NO_TOKEN_MSG)
  }
  const token = bearerRaw.substring(7)
  const sessionData = await session.get(token)
  if(sessionData != null){
    req.session = sessionData
    req.session.token = token
  } else {
    throw new Error(ERR_INVALID_TOKEN)
  }
}

async function verifyEmailPassword(req, rep){
  const pass = req.body.pass
  const userFromDb = await db('users').select(["id", "email", "pass"]).where({ email: req.body.email }).first()
  if(userFromDb == null){
    throw new Error(ERR_INVALID_EMAILPASS)
  }
  const checkPassword = await bcrypt.compare(pass, userFromDb.pass)
  if(checkPassword){
    return
  } else {
    throw new Error(ERR_INVALID_EMAILPASS)
  }
}

module.exports = {
  verifyToken,
  verifyEmailPassword
}
