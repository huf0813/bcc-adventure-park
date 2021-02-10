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

module.exports = {
  getAllParks,
  addPark,
  getParkById
}
