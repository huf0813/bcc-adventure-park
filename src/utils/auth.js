const session = require('./session')
const db = require('./db')
const bcrypt = require('bcrypt')

const ERR_NO_TOKEN_MSG = "Please supply a bearer token"
const ERR_INVALID_TOKEN = "Invalid token"
const ERR_INVALID_EMAILPASS = "Invalid email and/or password"

async function verifyToken(req, rep, done){
  const bearerRaw = req.headers.authorization
  if(bearerRaw == null){
    done(new Error(ERR_NO_TOKEN_MSG))
  }
  const token = bearerRaw.substring(7)
  const sessionData = await session.get(token)
  if(sessionData != null){
    req.auth.session = sessionData
    done()
  } else {
    done(new Error(ERR_INVALID_TOKEN))
  }
}

async function verifyEmailPassword(req, rep, done){
  const email = req.body.email
  const pass = req.body.pass
  const userFromDb = await db('users').select(["id", "email", "pass"]).where({ email: req.body.email }).first()
  const checkEmail = userFromDb.email == email
  const checkPassword = await bcrypt.compare(pass, userFromDb.pass)

  if(checkEmail && checkPassword){
    done()
  } else {
    done(new Error(ERR_INVALID_EMAILPASS))
  }
}

module.exports = {
  verifyToken,
  verifyEmailPassword
}
