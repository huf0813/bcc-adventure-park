const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp)
const db = require('../src/utils/db')
const session = require('../src/utils/session')

function assertIsValidFullParkObject(park){
  assert.isObject(park, "park is not an object")
  assert.hasAllKeys(park, ["id", "name", "details", "entranceFee"], "park object doesn't have the required keys")
  assert.typeOf(park.id, "number", "id is not a number")
  assert.typeOf(park.name, "string", "name is not a string")
  assert.typeOf(park.details, "string", "details is not a string")
  assert.typeOf(park.entranceFee, "number", "entranceFee is not a number")
}

const dummyPark = { name: "Integration Testing Park #1", details: "Integration Testing Park #1", entranceFee: 420360 }
const adminUser = { email: "admin@izfaruqi.com", name: "Chad AF Admin b0i", pass: "correct_horse_battery_staple" }
const visitorUser = { email: "pleb@izfaruqi.com", name: "pleb visitor", pass: "123456" }

function assertDummyPark(park){
  assertIsValidFullParkObject(park)
  assert.isNumber(park.id, "id should be generated and be a number")
  assert.equal(park.name, "Integration Testing Park #1", "name is not the same as provided")
  assert.equal(park.details, "Integration Testing Park #1", "details is not the same as provided")
  assert.equal(park.entranceFee, 420360, "entranceFee is not the same as provided")
}

describe("/park endpoints", function () {
  before(async function() {
    await db('parks').delete()
    await db('park_visits').delete()
    await db('users').delete()
    await session.clear()

    await this.requester.post("/user/register").send({ ...adminUser, isAdmin: true, token: true }).then((res, err) => {
      this.adminId = res.body.id
      this.adminToken = res.body.token.token
    })
    await this.requester.post("/user/register").send({ ...visitorUser, isAdmin: false, token: true }).then((res, err) => {
      this.visitorId = res.body.id
      this.visitorToken = res.body.token.token
    })
    assert.include(await db('users').select(["email", "name", "level"]).where({ id: this.adminId }).first(), { email: adminUser.email, name: adminUser.name, level: "admin" }, "insert new admin user unsuccessful")
    assert.include(await db('users').select(["email", "name", "level"]).where({ id: this.visitorId }).first(), { email: visitorUser.email, name: visitorUser.name, level: "visitor" })
  })

  describe("POST /park, for inserting a park", function(){
    describe('insert a new park with full information as an admin', function(){
      before(function(done){
        this.requester.post('/park')
          .set("Authorization", "Bearer " + this.adminToken)
          .send(dummyPark)
          .then((res, err) => {
            if(err){ console.error(err) }
            this.requestResult = res
            done()
          })
      })
  
      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })
  
      it('should return the id of the inserted park', function(done){
        assert.isObject(this.requestResult.body, "response is not an object")
        assert.hasAllKeys(this.requestResult.body, ["id"], "id key does not exist")
        assert.isNumber(this.requestResult.body.id, "id is not a number")
        done()
      })
    })
  
    describe('insert a new park with partial information as an admin', function(){
      before(function(done){
        this.requester.post('/park')
          .set("Authorization", "Bearer " + this.adminToken)  
          .send({ name: dummyPark.name, entranceFee: dummyPark.entranceFee })
          .then((res, err) => {
            if(err){ console.error(err) }
            this.requestResult = res
            done()
          })
      })
  
      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })
  
      it('should return the id of the inserted park', function(done){
        assert.isObject(this.requestResult.body, "response is not an object")
        assert.hasAllKeys(this.requestResult.body, ["id"], "id key does not exist")
        assert.isNumber(this.requestResult.body.id, "id is not a number")
        done()
      })
    })
  
    describe('insert a new park with no name as an admin', function(){
      before(function(done){
        this.requester.post('/park')
          .set("Authorization", "Bearer " + this.adminToken)
          .send({ details: dummyPark.details, entranceFee: dummyPark.entranceFee })
          .then((res, err) => {
            if(err){ console.error(err) }
            this.requestResult = res
            done()
          })
      })
  
      it('should return status code 400', function(done){
        assert.equal(this.requestResult.status, 400)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })

    describe('insert a new park with full information as a visitor', function(){
      before(function(done){
        this.requester.post('/park')
          .set("Authorization", "Bearer " + this.visitorToken)
          .send(dummyPark)
          .then((res, err) => {
            if(err){ console.error(err) }
            this.requestResult = res
            done()
          })
      })
  
      it('should return status code 401', function(done){
        assert.equal(this.requestResult.status, 401)
        done()
      })
  
      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })

    describe('insert a new park with full information without a token', function(){
      before(function(done){
        this.requester.post('/park')
          .send(dummyPark)
          .then((res, err) => {
            if(err){ console.error(err) }
            this.requestResult = res
            done()
          })
      })
  
      it('should return status code 401', function(done){
        assert.equal(this.requestResult.status, 401)
        done()
      })
  
      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })

    describe('insert a new park with no name as a visitor', function(){
      before(function(done){
        this.requester.post('/park')
          .set("Authorization", "Bearer " + this.visitorToken)
          .send({ details: dummyPark.details, entranceFee: dummyPark.entranceFee })
          .then((res, err) => {
            if(err){ console.error(err) }
            this.requestResult = res
            done()
          })
      })
  
      it('should return status code 400', function(done){
        assert.equal(this.requestResult.status, 400)
        done()
      })
  
      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })
  })

  describe("GET /park, for retrieving a park(s)", function(){
    describe('GET /park, get list of parks', function(){
      before(function(done){
        this.requester.get('/park')
          .then((res, err) => {
            if(err){ console.error(err) }
            this.requestResult = res
            done()    
          })
      })
      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })
      it('body should be an object that contains total (number) and parks (array)', function(done){
        const res = this.requestResult.body
        assert.isObject(res, "body is not an object")
        assert.hasAllKeys(res, ["total", "parks"], "body does not have the required keys")
        assert.typeOf(res.total, "number", "total is not a number")
        assert.isArray(res.parks, "parks is not an array")
        done()
      })
  
      it('assert each park object inside parks', function(done){
        if(this.requestResult.body.parks.length != 0){
          this.requestResult.body.parks.forEach(park => assertIsValidFullParkObject(park))
        }
        done()
      })
    })
    
    describe('GET /park/:id, get an existing park with an id', function(){
      before(async function(){
        await this.requester.post("/park").set("Authorization", "Bearer " + this.adminToken).send(dummyPark).then((res, err) => {
          this.idToBeTested = res.body.id
        })
        await this.requester.get("/park/" + this.idToBeTested).then((res, err) => {
          this.requestResult = res
        })
      })
  
      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })
  
      it('should return a full park object with dummy park information', function(done){
        assertDummyPark(this.requestResult.body)
        done()
      })
    })
  
    describe('GET /park/:id, try to get a nonexistant park id', function(){
      before(async function(){
        await this.requester.get("/park/-1").then((res, err) => {
          this.requestResult = res
        })
      })
  
      it('should return status code 404', function(done){
        assert.equal(this.requestResult.status, 404)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })
  
    describe('GET /park/:id, try to use an invalid id (non-numeric)', function(){
      before(async function(){
        await this.requester.get("/park/bcc").then((res, err) => {
          this.requestResult = res
        })
      })
  
      it('should return status code 400', function(done){
        assert.equal(this.requestResult.status, 400)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })
  })

  describe('PATCH /park/:id, for editing parks', function(){
    const modifiedPark = { name: "Integration Testing Park #2", details: "UUHHH testing...", entranceFee: 360420 }
    before(async function(){
      await this.requester.post('/park').set("Authorization", "Bearer " + this.adminToken).send(dummyPark).then((res, err) => {
        this.idToBeTested = res.body.id
      })
    })

    describe("edit a park's name as an admin", function(){
      before(async function(){
        await this.requester.patch('/park/' + this.idToBeTested).set("Authorization", "Bearer " + this.adminToken).send({ name: modifiedPark.name }).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })

      it('should return the current name of the edited park', function(done){
        assert.isObject(this.requestResult.body)
        assert.hasAllKeys(this.requestResult.body, ["name"], "body does not have the required keys")
        assert.equal(this.requestResult.body.name, modifiedPark.name, "name returned does not match the name given")
        done()
      })
    })

    describe("edit a park's details as an admin", function(){
      before(async function(){
        await this.requester.patch('/park/' + this.idToBeTested).set("Authorization", "Bearer " + this.adminToken).send({ details: modifiedPark.details }).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })

      it('should return the current details of the edited park', function(done){
        assert.isObject(this.requestResult.body)
        assert.hasAllKeys(this.requestResult.body, ["details"], "body does not have the required keys")
        assert.equal(this.requestResult.body.details, modifiedPark.details, "details returned does not match the details given")
        done()
      })
    })

    describe("edit a park's entrance fee as an admin", function(){
      before(async function(){
        await this.requester.patch('/park/' + this.idToBeTested).set("Authorization", "Bearer " + this.adminToken).send({ entranceFee: modifiedPark.entranceFee }).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })

      it('should return the current entrance fee of the edited park', function(done){
        assert.isObject(this.requestResult.body)
        assert.hasAllKeys(this.requestResult.body, ["entranceFee"], "body does not have the required keys")
        assert.equal(this.requestResult.body.entranceFee, modifiedPark.entranceFee, "entranceFee returned does not match the entranceFee given")
        done()
      })
    })

    describe("check the edited park with GET /park/:id", function(){
      before(async function(){
        await this.requester.get('/park/' + this.idToBeTested).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })

      it("the park that's returned by /park/:id should match all the modifications done in the tests above", function(done){
        const park = this.requestResult.body
        assert.equal(park.name, modifiedPark.name, "park name is different")
        assert.equal(park.details, modifiedPark.details, "park details is different")
        assert.equal(park.entranceFee, modifiedPark.entranceFee, "park entranceFee is different")
        done()
      })
    })

    describe('try to edit a nonexistant park id as an admin', function(){
      before(async function(){
        await this.requester.patch("/park/-1").send({ name: modifiedPark.name }).set("Authorization", "Bearer " + this.adminToken).then((res, err) => {
          this.requestResult = res
        })
      })
  
      it('should return status code 404', function(done){
        assert.equal(this.requestResult.status, 404)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })
  
    describe('try to edit with an invalid id (non-numeric) as an admin', function(){
      before(async function(){
        await this.requester.patch("/park/bcc").set("Authorization", "Bearer " + this.adminToken).send({ name: modifiedPark.name }).then((res, err) => {
          this.requestResult = res
        })
      })
  
      it('should return status code 400', function(done){
        assert.equal(this.requestResult.status, 400)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })

    describe("try to edit a park's name as a non-admin", function(){
      before(async function(){
        await this.requester.patch('/park/' + this.idToBeTested).set("Authorization", "Bearer " + this.visitorToken).send({ name: modifiedPark.name }).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 401', function(done){
        assert.equal(this.requestResult.status, 401)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })
  })

  describe('DELETE /park/:id, for deleting a park', function(){
    before(async function(){
      await this.requester.post('/park').set("Authorization", "Bearer " + this.adminToken).send(dummyPark).then((res, err) => {
        this.idToBeTested = res.body.id
      })
    })
    describe('delete a park by a valid id as an admin', function(){
      before(async function(){
        await this.requester.delete('/park/' + this.idToBeTested).set("Authorization", "Bearer " + this.adminToken).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })

      it('should return a success message object', function(done){
        assert.equal(this.requestResult.body.message, "success")
        done()
      })

      it('the deleted park should not be obtainable by GET /park/:id with a non-admin', async function(){
        await this.requester.get('/park/' + this.idToBeTested).then((res, err) => {
          assert.equal(res.status, 404)
        })
      })
    })

    describe('permanently delete a park by a valid id as an admin', function(){
      before(async function(){
        await this.requester.post('/park').set("Authorization", "Bearer " + this.adminToken).send(dummyPark).then((res, err) => {
          this.idToBeTested = res.body.id
        })
        await this.requester.delete('/park/' + this.idToBeTested + "?permanent=true").set("Authorization", "Bearer " + this.adminToken).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })

      it('should return a success message object', function(done){
        assert.equal(this.requestResult.body.message, "success")
        done()
      })

      it('the deleted park should not be obtainable by GET /park/:id for a non-admin', async function(){
        await this.requester.get('/park/' + this.idToBeTested).then((res, err) => {
          assert.equal(res.status, 404)
        })
      })

      it('the deleted park should not exist in the db', async function(){
        assert.isNull(await db('parks').select("*").where({ id: this.idToBeTested }).first())
      })
    })

    describe('try to delete a park by a nonexistant id as an admin', function(){
      before(async function(){
        await this.requester.delete('/park/-1').set("Authorization", "Bearer " + this.adminToken).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 404', function(done){
        assert.equal(this.requestResult.status, 404)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })

    describe('try to delete a park by an invalid id (non-numeric) as an admin' , function(){
      before(async function(){
        await this.requester.delete('/park/bcc').set("Authorization", "Bearer " + this.adminToken).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 400', function(done){
        assert.equal(this.requestResult.status, 400)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })

    describe('try to delete a park as a non-admin' , function(){
      before(async function(){
        await this.requester.delete('/park/' + this.idToBeTested).set("Authorization", "Bearer " + this.visitorToken).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 401', function(done){
        assert.equal(this.requestResult.status, 401)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })
  })

  describe('GET /park/:id/visit, for visiting a park', function(){
    const newUser = { email: "izf@izfaruqi.com", pass: "Tr0ub4dor&3", name: "izfaruqi" }

    before(async function(){
      await db('park_visits').delete()
      await db('users').delete()
      await db('parks').delete()
      await session.clear()
      await this.requester.post("/user/register").send({ ...newUser, token: true }).then((res, err) => {
        this.idUserToBeTested = res.body.id
        this.tokenToBeTested = res.body.token.token
      })
      await this.requester.post("/user/register").send({ ...adminUser, isAdmin: true, token: true }).then((res, err) => {
        this.adminId = res.body.id
        this.adminToken = res.body.token.token
      })
      await this.requester.post("/user/balance").set("Authorization", "Bearer " + this.tokenToBeTested).send({ balance: 1337000 })
      await this.requester.post('/park').set("Authorization", "Bearer " + this.adminToken).send(dummyPark).then((res, err) => {
        this.idParkToBeTested = res.body.id
      })
    })

    describe('visit a park as a valid registered user with sufficient balance', function(){
      before(async function(){
        await this.requester.get('/park/' + this.idParkToBeTested + "/visit").set("Authorization", "Bearer " + this.tokenToBeTested).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })

      it('should return spent balance, current balance, and a message', function(done){
        const resBody = this.requestResult.body
        assert.isObject(resBody)
        assert.hasAllKeys(resBody, ["balance", "message"])
        assert.hasAllKeys(resBody.balance, ["spent", "current"])
        assert.isNumber(resBody.balance.spent)
        assert.isNumber(resBody.balance.current)
        done()
      })
    })

    describe('visit a park as a valid registered user with insufficient balance', function(){
      before(async function(){
        await this.requester.post("/user/balance").set("Authorization", "Bearer " + this.tokenToBeTested).send({ balance: 1337 })
        await this.requester.get('/park/' + this.idParkToBeTested + "/visit").set("Authorization", "Bearer " + this.tokenToBeTested).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 403', function(done){
        assert.equal(this.requestResult.status, 403)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })

    describe('visit a park as an unregistered user', function(){
      before(async function(){
        await this.requester.get('/park/' + this.idParkToBeTested + "/visit").then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 401', function(done){
        assert.equal(this.requestResult.status, 401)
        done()
      })

      it('should return an error message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["error", "message"])
        done()
      })
    })
  })

  after(function(done){
    db('parks').delete().then(() => done())
  })
})
