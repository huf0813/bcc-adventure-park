const db = require('../utils/db')
const defaultParkObject = {
  name: "",
  details: "",
  entranceFee: 0,
  isDeleted: 0
}

async function getAllParks(includeDeleted = false){
  if(includeDeleted){
    return await db('parks').select(["id", "name", "details", "entranceFee", "isDeleted"])
  } else {
    return await db('parks').select(["id", "name", "details", "entranceFee"]).where({ isDeleted: 0})
  }
}

async function getParkById(id, includeDeleted = false){
  if(includeDeleted){
    return await db('parks').select(["id", "name", "details", "entranceFee"]).where({ id: id }).first()
  } else {
    return await db('parks').select(["id", "name", "details", "entranceFee"]).where({ id: id, isDeleted: 0 }).first()
  }
}

async function addPark(park){
  const fullPark = {...defaultParkObject, ...park}
  const insertedId = await db('parks').insert(fullPark)
  return { id: insertedId, ...fullPark }
}

async function editParkById(id, partialPark){
  return await db('parks').where({ id: id, isDeleted: 0 }).update({ ...partialPark })
}

async function deleteParkById(id){
  return await db('parks').where({ id: id, isDeleted: 0 }).update({ isDeleted: 1 })
}

async function visitPark(parkId, userId){
  return await db.transaction(async trx => {
    const currentParkEntranceFee = (await trx('parks').where({ id: parkId, isDeleted: 0 }).select("entrance_fee").first()).entranceFee
    const currentUserBalance = (await trx('users').where({ id: userId }).select("balance").first()).balance

    if(currentUserBalance >= currentParkEntranceFee){
      await trx('users').where({ id: userId }).update({ balance: currentUserBalance - currentParkEntranceFee })
      await trx('park_visits').insert({ parkId: parkId, userId: userId, entranceFeeOnVisit: currentParkEntranceFee, visitedOn: Date.now() })
      return { balance: { spent: currentParkEntranceFee, current: currentUserBalance - currentParkEntranceFee } }
    } else {
      const err = new Error("Insufficient balance")
      err.name = "VISIT_INSUFFICIENT_BALANCE"
      throw err
    }
  })
}

module.exports = {
  getAllParks,
  addPark,
  getParkById,
  editParkById,
  deleteParkById,
  visitPark
}
