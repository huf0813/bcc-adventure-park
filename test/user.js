const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp)
const db = require('../src/utils/db')
const session = require('../src/utils/session')

const newUser = { email: "izf@izfaruqi.com", pass: "Tr0ub4dor&3", name: "izfaruqi" }

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
      })

      it('token should be valid', async function(){
        assert.isNotNull(await session.get(this.requestResult.body.token.token))
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

    describe('/user/balance endpoints, for actions regarding user balance', function(){
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
  })
})
