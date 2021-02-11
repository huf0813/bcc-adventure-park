const bcrypt = require('bcrypt')
const db = require('../utils/db')

const LEVEL_VISITOR = "visitor"
const LEVEL_ADMIN = "admin"
const defaultUserObject = {
  email: "",
  name: "",
  pass: "",
  balance: 0,
  level: LEVEL_VISITOR,
}

async function addUser(user){
  const hashedPass = await bcrypt.hash(user.pass, 10)
  return await db('users').insert({ ...defaultUserObject, ...user, pass: hashedPass })
}

async function getUserById(id){
  return await db('users').select(["id", "email", "name", "level", "balance"]).where({ id: id }).first()
}

async function setUserBalance(id, newBalance){
  return await db('users').where({ id: id }).update({ balance: newBalance })
}

async function topupUserBalance(id, topupAmount){
  const initialUserBalance = (await getUserById(id)).balance
  await setUserBalance(id, initialUserBalance + topupAmount)
  return initialUserBalance + topupAmount
}

module.exports = {
  LEVEL_VISITOR,
  LEVEL_ADMIN,
  addUser,
  getUserById,
  setUserBalance,
  topupUserBalance
}
