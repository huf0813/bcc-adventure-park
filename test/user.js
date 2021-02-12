const chai = require('chai');
const chaiHttp = require('chai-http');
const { as } = require('../src/utils/db');
const assert = chai.assert;

chai.use(chaiHttp)
const db = require('../src/utils/db')
const session = require('../src/utils/session')

const newUser = { email: "izf@izfaruqi.com", pass: "Tr0ub4dor&3", name: "izfaruqi" }
const dummyPark1 = { name: "Integration Testing Park #1", details: "Very fun park #1", entranceFee: 111111 }
const dummyPark2 = { name: "Integration Testing Park #2", details: "Very fun park #2", entranceFee: 222222 }
const dummyPark3 = { name: "Integration Testing Park #3", details: "Very fun park #3", entranceFee: 333333 }

function assertValidTokenObject(token){
  assert.isObject(token, "token is not an object")
  assert.hasAllKeys(token, ["token", "expiresAt"], "token doesn't have the required keys")
  assert.isString(token.token)
  assert.isNumber(token.expiresAt)
}

describe('/user endpoints', function(){
  describe('POST /user/register, for registering new users', function(){
    const url = "/user/register"
    describe('insert a new user with an email, password, and name', function(){
      before(async function(){
        await db('users').delete()
        await session.clear()
        await this.requester.post(url).send({ email: newUser.email, pass: newUser.pass, name: newUser.name }).then((res, err) => {
          this.requestResult = res
        })
      })
  
      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })
  
      it('should return a success message and the new user id', function(done){
        assert.hasAllKeys(this.requestResult.body, ["message", "id"], "body does not have the required keys")
        assert.isNumber(this.requestResult.body.id)
        assert.equal(this.requestResult.body.message, "success", "message returned is not success")
        done()
      })
  
      it('new user should be available in the db', async function(){
          const userFromDb = await db('users').select(["id", "email", "name"]).where({ email: newUser.email }).first()
          assert.isDefined(userFromDb, "new user not found in the db")
          assert.include({ id: this.requestResult.body.id, ...newUser}, userFromDb)
      })
    })

    describe('insert a new user and request token with an email and a password', function(){
      before(async function(){
        await db('users').delete()
        await this.requester.post(url).send({ email: newUser.email, pass: newUser.pass, token: true }).then((res, err) => {
          this.requestResult = res
        })
      })
  
      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })
  
      it('should return a token, the new user id, and a success message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["message", "token", "id"], "body does not have the required keys")
        assert.isNumber(this.requestResult.body.id)
        assert.equal(this.requestResult.body.message, "success", "message returned is not success")
        assertValidTokenObject(this.requestResult.body.token)
        done()
      })
  
      it('new user should be available in the db', async function(){
        const userFromDb = await db('users').select("*").where({ email: newUser.email }).first()
        assert.isDefined(userFromDb, "new user not found in the db")
        assert.equal(userFromDb.level, "visitor", "new user is not visitor")
      })

      it('token should be valid', async function(){
        assert.isDefined(await session.get(this.requestResult.body.token.token))
      })
    })

    describe('insert a new admin user and request token with an email and a password', function(){
      before(async function(){
        await db('users').delete()
        await this.requester.post(url).send({ email: newUser.email, pass: newUser.pass, token: true, isAdmin: true }).then((res, err) => {
          this.requestResult = res
        })
      })
  
      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })
  
      it('should return a token, the new user id, and a success message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["message", "token", "id"], "body does not have the required keys")
        assert.isNumber(this.requestResult.body.id)
        assert.equal(this.requestResult.body.message, "success", "message returned is not success")
        assertValidTokenObject(this.requestResult.body.token)
        done()
      })
  
      it('new admin user should be available in the db', async function(){
        const userFromDb = await db('users').select("*").where({ email: newUser.email }).first()
        assert.isDefined(userFromDb, "new user not found in the db")
        assert.equal(userFromDb.level, "admin", "new user is not admin")
      })

      it('token should be valid', async function(){
        assert.isDefined(await session.get(this.requestResult.body.token.token))
      })
    })

    describe('try to insert a new user with only an email', function(){
      before(async function(){
        await db('users').delete()
        await this.requester.post(url).send({ email: newUser.email }).then((res, err) => {
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

    describe('try to insert a new user with only a password', function(){
      before(async function(){
        await db('users').delete()
        await this.requester.post(url).send({ pass: newUser.pass }).then((res, err) => {
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

    describe('try to insert a user with an email that already exists in the db', function(){
      before(async function(){
        await db('users').delete()
        await this.requester.post(url).send({ email: newUser.email, pass: newUser.pass }).then((res, err) => {
        })
        await this.requester.post(url).send({ email: newUser.email, pass: newUser.pass + "_its_a_different_pass_now" }).then((res, err) => {
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
  
      it('no new user should be available in the db', async function(){
          const userFromDb = await db('users').select("*").where({ email: newUser.email })
          assert.lengthOf(userFromDb, 1, "new user found in the db")
      })
    })
  })

  describe('GET /user, for getting complete user profile', function(){
    const url = "/user"
    before(async function(){
      await db('users').delete()
      await session.clear()
      await this.requester.post(url + "/register").send({ ...newUser, token: true }).then((res, err) => {
        this.idToBeTested = res.body.id
        this.tokenToBeTested = res.body.token.token
      })
    })

    describe('get self profile (token provided)', function(){
      before(async function(){
        await this.requester.get(url).set("Authorization", "Bearer " + this.tokenToBeTested).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })

      it('should return the same user data as the ones provided', function(done){
        const returnedUser = this.requestResult.body
        assert.equal(returnedUser.id, this.idToBeTested)
        assert.equal(returnedUser.email, newUser.email)
        assert.equal(returnedUser.balance, 0)
        done()
      })
    })

    describe('get self profile (token not provided)', function(){
      before(async function(){
        await this.requester.get(url).then((res, err) => {
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

    describe('get self profile (invalid token)', function(){
      before(async function(){
        await this.requester.get(url).set("Authorization", "Bearer 0w0").then((res, err) => {
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

  describe('/user/balance endpoints, for actions regarding user balance', function(){
    const url = "/user"
    before(async function(){
      await db('users').delete()
      await session.clear()
      await this.requester.post(url + "/register").send({ ...newUser, token: true }).then((res, err) => {
        this.idToBeTested = res.body.id
        this.tokenToBeTested = res.body.token.token
      })
    })

    describe('GET /user/balance, for getting user balance', function(){
      describe('get self balance (token provided)', function(){
        before(async function() {
          await this.requester.get(url + "/balance").set("Authorization", "Bearer " + this.tokenToBeTested).then((res, err) => {
            this.requestResult = res
          })
        })

        it('should return status code 200', function(done){
          assert.equal(this.requestResult.status, 200)
          done()
        })

        it('balance should be 0 for new users', function(done){
          assert.equal(this.requestResult.body.balance, 0)
          done()
        })
      })
    })

    describe('POST /user/balance, for setting user balance', function(){
      describe('set self balance (token provided)', function(){
        const newBalance = 133700
        before(async function() {
          await this.requester.post(url + "/balance").set("Authorization", "Bearer " + this.tokenToBeTested).send({ balance: newBalance }).then((res, err) => {
            this.requestResult = res
          })
        })

        it('should return status code 200', function(done){
          assert.equal(this.requestResult.status, 200)
          done()
        })

        it('should return the current balance for the user', function(done){
          assert.equal(this.requestResult.body.balance, newBalance)
          done()
        })

        it('balance update should be reflected in the db', async function(){
          assert.equal((await db('users').where({ id: this.idToBeTested }).select("balance").first()).balance, newBalance)
        })
      })
    })

    describe('POST /user/balance/topup, for topping up user balance', function(){
      describe('top up self balance (token provided)', function(){
        const topupAmount = 42000
        before(async function() {
          this.initialUserBalance = (await db('users').where({ id: this.idToBeTested }).select("balance").first()).balance
          await this.requester.post(url + "/balance/topup").set("Authorization", "Bearer " + this.tokenToBeTested).send({ amount: topupAmount }).then((res, err) => {
            this.requestResult = res
          })
        })

        it('should return status code 200', function(done){
          assert.equal(this.requestResult.status, 200)
          done()
        })

        it('should return the current balance for the user', function(done){
          assert.equal(this.requestResult.body.balance, topupAmount + this.initialUserBalance)
          done()
        })

        it('balance update should be reflected in the db', async function(){
          assert.equal((await db('users').where({ id: this.idToBeTested }).select("balance").first()).balance, topupAmount + this.initialUserBalance)
        })
      })
    })
  })

  describe('/user/invoice, for actions regarding user invoices', function(){
    const url = "/user"
    before(async function(){
      await db('users').delete()
      await session.clear()
      await this.requester.post(url + "/register").send({ ...newUser, token: true }).then((res, err) => {
        this.idToBeTested = res.body.id
        this.tokenToBeTested = res.body.token.token
      })
    })
    before(async function() {
      await db('park_visits').delete()
      await db('parks').delete()
      await this.requester.post("/park").send(dummyPark1).then((res, err) => this.dummyPark1Id = res.body.id)
      await this.requester.post("/park").send(dummyPark2).then((res, err) => this.dummyPark2Id = res.body.id)
      await this.requester.post("/park").send(dummyPark3).then((res, err) => this.dummyPark3Id = res.body.id)
      await this.requester.post(url + "/balance").set("Authorization", "Bearer " + this.tokenToBeTested).send({ balance: 6666666 })
      await this.requester.get("/park/" + this.dummyPark1Id + "/visit").set("Authorization", "Bearer " + this.tokenToBeTested)
      await this.requester.get("/park/" + this.dummyPark2Id + "/visit").set("Authorization", "Bearer " + this.tokenToBeTested)
      await this.requester.get("/park/" + this.dummyPark3Id + "/visit").set("Authorization", "Bearer " + this.tokenToBeTested)
      await this.requester.delete("/park/" + this.dummyPark2Id)
    })

    describe('GET /user/invoice, for getting a list of all invoices from self', function(){
      before(async function(){
        await this.requester.get(url + "/invoice").set("Authorization", "Bearer " + this.tokenToBeTested).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })

      it('should return the total balance spent and the list of invoices', function(done){
        const res = this.requestResult.body
        assert.isObject(res)
        assert.hasAllKeys(res, ["totalSpent", "totalInvoices", "invoices"])
        assert.isNumber(res.totalSpent)
        assert.isNumber(res.totalInvoices)
        assert.isArray(res.invoices)
        done()
      })

      it('check every invoice object', function(done){
        this.requestResult.body.invoices.forEach(invoice => {
          assert.isNumber(invoice.id)
          assert.isNumber(invoice.visitedOn)
          assert.isNumber(invoice.entranceFeeOnVisit)
          assert.hasAllKeys(invoice.park, ["id", "name", "isParkDeleted"])
          assert.isNumber(invoice.park.id)
          assert.isBoolean(invoice.park.isParkDeleted)
        })
        done()
      })
    })
  })

  describe('/user/token, for actions regarding user tokens', function(){
    const url = "/user"

    describe('GET /user/token, for getting a new token for a user', function(){
      before(async function(){
        await db('users').delete()
        await session.clear()
        await this.requester.post(url + "/register").send({ ...newUser, token: true }).then((res, err) => {
          this.idToBeTested = res.body.id
          this.tokenToBeTested = res.body.token.token
        })
      })

      describe('get a new token for the user provided by the old token', function(){
        before(async function(){
          await this.requester.get(url + '/token').set("Authorization", "Bearer " + this.tokenToBeTested).then((res, err) => {
            this.requestResult = res
          })
        })

        it('should return status code 200', function(done){
          assert.equal(this.requestResult.status, 200)
          done()
        })

        it('should return a new token', function(done){
          const res = this.requestResult.body
          assert.hasAllKeys(res, ["token", "expiresAt"])
          assert.isString(res.token)
          assert.isNumber(res.expiresAt)
          done()
        })

        it('new token should be valid', async function(){
          assert.isDefined(await session.get(this.requestResult.body.token), "token returned is invalid")
        })

        it('old token should be invalid', async function(){
          assert.isUndefined(await session.get(this.tokenToBeTested), "old token still valid")
        })

        after(function(){
          this.tokenToBeTested = this.requestResult.body.token
        })
      })

      describe('get a new token for the user with an invalid token', function(){
        before(async function(){
          await this.requester.post(url + "/register").send({ ...newUser, email: "qq@izfaruqi.com", token: true }).then((res, err) => {
            this.idToBeTested = res.body.id
            this.tokenToBeTested = res.body.token.token
          })
          await this.requester.get(url + '/token').set("Authorization", "Bearer 0wo").then((res, err) => {
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

        it('old token should still be valid', async function(){
          assert.isDefined(await session.get(this.tokenToBeTested), "old token is invalid")
        })

        after(function(){
          this.tokenToBeTested = this.requestResult.body.token
        })
      })
    })

    describe('POST /user/token, for getting a new token for a user by email and password', function(){
      before(async function(){
        await db('users').delete()
        await session.clear()
        await this.requester.post(url + "/register").send({ ...newUser, token: true }).then((res, err) => {
          this.idToBeTested = res.body.id
          this.tokenToBeTested = res.body.token.token
        })
      })

      describe('get a new token for the user provided by email and password', function(){
        before(async function(){
          this.oldToken = await session.get("token_" + this.idToBeTested)
          await this.requester.post(url + '/token').send({ email: newUser.email, pass: newUser.pass }).then((res, err) => {
            this.requestResult = res
          })
        })

        it('should return status code 200', function(done){
          assert.equal(this.requestResult.status, 200)
          done()
        })

        it('should return a new token', function(done){
          const res = this.requestResult.body
          assert.hasAllKeys(res, ["token", "expiresAt"])
          assert.isString(res.token)
          assert.isNumber(res.expiresAt)
          done()
        })

        it('new token should be valid', async function(){
          assert.isDefined(await session.get(this.requestResult.body.token), "token returned is invalid")
        })

        it('old token should be invalid', async function(){
          assert.isUndefined(await session.get(this.oldToken), "old token is still valid")
        })

        after(function(){
          this.tokenToBeTested = this.requestResult.body.token
        })
      })

      describe('get a new token for the user with an invalid user and password', function(){
        before(async function(){
          this.oldToken = await session.get("token_" + this.idToBeTested)
          await this.requester.post(url + '/token').send({ email: "make_it_invalid" + newUser.email, pass: "make_it_invalid" + newUser.pass }).then((res, err) => {
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
  })

  describe('DELETE /user, for deleting user tied to provided token', function(){
    const url = "/user"
    before(async function(){
      await db('users').delete()
      await session.clear()
      await this.requester.post(url + "/register").send({ ...newUser, token: true }).then((res, err) => {
        this.idToBeTested = res.body.id
        this.tokenToBeTested = res.body.token.token
      })
      this.currentUserBalance = (await db('users').where({ id: this.idToBeTested }).select("balance").first()).balance
    })

    describe('delete self (token provided)', function(){
      before(async function(){
        await this.requester.delete(url).set("Authorization", "Bearer " + this.tokenToBeTested).then((res, err) => {
          this.requestResult = res
        })
      })

      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })
  
      it("should only return a success message and the user's remaining balance", function(done){
        assert.hasAllKeys(this.requestResult.body, ["balance", "message"], "body does not have the required keys")
        assert.equal(this.requestResult.body.balance, this.currentUserBalance)
        assert.equal(this.requestResult.body.message, "success", "message returned is not success")
        done()
      })

      it('token and user should no longer exist in db', async function(){
        assert.isUndefined(await db('users').where({ id: this.idToBeTested }).select("*").first(), "user still exists on db")
        assert.isUndefined(await session.get(this.tokenToBeTested), "token is still valid")
      })
    })
  })
})
