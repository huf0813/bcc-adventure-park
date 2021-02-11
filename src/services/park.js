const park = require('../routes/park')
const user = require('../routes/user')
const db = require('../utils/db')
const defaultParkObject = {
  name: "",
  details: "",
  entranceFee: 0
}

async function getAllParks(){
  return await db('parks').select("*") 
}

async function getParkById(id){
  return await db('parks').select("*").where({ id: id }).first()
}

async function addPark(park){
  const fullPark = {...defaultParkObject, ...park}
  const insertedId = await db('parks').insert(fullPark)
  return { id: insertedId, ...fullPark }
}

async function editParkById(id, partialPark){
  return await db('parks').where({ id: id }).update({ ...partialPark })
}

async function deleteParkById(id){
  return await db('parks').where({ id: id }).delete()
}

async function visitPark(parkId, userId){
  return await db.transaction(async trx => {
    const currentParkEntranceFee = (await trx('parks').where({ id: parkId }).select("entrance_fee").first()).entranceFee
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
