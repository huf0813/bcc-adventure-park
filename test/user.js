const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp)
const db = require('../src/utils/db')
const session = require('../src/utils/session')

const newUser = { email: "izf@izfaruqi.com", pass: "Tr0ub4dor&3" }

function assertValidTokenObject(token){
  assert.isObject(token, "token is not an object")
  assert.hasAllKeys(token, ["token", "expiresAt"], "token doesn't have the required keys")
  assert.isString(token.token)
  assert.isNumber(token.expiresAt)
}

describe('/user endpoints', function(){
  describe('POST /user, for registering new users', function(){
    const url = "/user/register"
    describe('insert a new user with an email and a password', function(){
      before(async function(){
        await db('users').delete()
        await this.requester.post(url).send({ email: newUser.email, pass: newUser.pass }).then((res, err) => {
          this.requestResult = res
        })
      })
  
      it('should return status code 200', function(done){
        assert.equal(this.requestResult.status, 200)
        done()
      })
  
      it('should only return a success message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["message"], "body does not have the required keys")
        assert.equal(this.requestResult.body.message, "success", "message returned is not success")
        done()
      })
  
      it('new user should be available in the db', async function(){
          const userFromDb = await db('users').select("*").where({ email: newUser.email }).first()
          assert.isDefined(userFromDb, "new user not found in the db")
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
  
      it('should return a token and a success message', function(done){
        assert.hasAllKeys(this.requestResult.body, ["message", "token"], "body does not have the required keys")
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
  
      it('no new user should be available in the db', async function(){
          const userFromDb = await db('users').select("*").where({ email: newUser.email })
          assert.lengthOf(userFromDb, 1, "new user found in the db")
      })
    })
  })
})
