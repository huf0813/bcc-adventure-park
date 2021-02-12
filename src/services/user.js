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

async function deleteUser(id){
  await db('users').where({ id: id }).delete()
}

async function getUserInvoices(userId){
  const invoicesRaw = await db('park_visits').leftJoin("parks", "parks.id", "park_visits.park_id").select(["park_visits.id", "park_visits.id as park_id", "parks.name", "parks.is_deleted as is_park_deleted", "park_visits.entranceFeeOnVisit", "park_visits.visitedOn"]).where({ userId: userId })
  const invoices = invoicesRaw.map(invoice => {
    const park = { id: invoice.parkId, name: invoice.name, isParkDeleted: invoice.isParkDeleted? true : false }
    return { id: invoice.id, entranceFeeOnVisit: invoice.entranceFeeOnVisit, visitedOn: invoice.visitedOn, park: park }
  })
  const totalSpent = invoices.reduce((acc, invoice) => acc + invoice.entranceFeeOnVisit, 0)
  return { totalSpent: totalSpent, totalInvoices: invoices.length, invoices: invoices }
}

async function getAllUsers(){
  const usersList = await db('users').select(["id", "email", "name", "balance", "level"])
  let totalAdmins = 0
  let totalVisitors = 0
  usersList.forEach(user => {
    if(user.level == "admin"){
      totalAdmins++
    } else {
      totalVisitors++
    }
  })
  return { totalUsers: usersList.length, totalAdmins: totalAdmins, totalVisitors: totalVisitors, users: usersList }
}

module.exports = {
  LEVEL_VISITOR,
  LEVEL_ADMIN,
  addUser,
  getUserById,
  setUserBalance,
  topupUserBalance,
  deleteUser,
  getUserInvoices,
  getAllUsers
}
