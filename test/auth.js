const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp)
const db = require('../src/utils/db')

const newUser = { email: "izf@izfaruqi.com", pass: "Tr0ub4dor&3" }

describe('/auth endpoints', function(){
  describe('POST /auth/register, for registering new users', function(){
    before(async function(){
      await this.requester.post('/auth/register').send({ email: newUser.email, pass: newUser.pass }).then((res, err) => {
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

    it('new user should be available on db', async function(){
        const userFromDb = await db('users').select("*").where({ email: newUser.email }).first()
        assert.isDefined(userFromDb, "new user not found on db")
        userFromDb
    })
  })
})
