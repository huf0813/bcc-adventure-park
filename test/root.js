const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index').server;
const assert = chai.assert;

chai.use(chaiHttp)
let requester

before(async function(){ 
  requester = chai.request(await server.listen(0)).keepOpen()
})

describe("/ endpoint", function () {
  describe('GET /', function(){
    it('should return status code 200', (done) => {
      requester.get('/')
        .end((err, res) => {
          if(err){ console.error(err) }
          assert.equal(res.status, 200)
          done()    
        })
    })
    it('body should only contain a version information', (done) => {
      requester.get('/')
        .end((err, res) => {
          if(err){ console.error(err) }
          assert.isObject(res.body, "body is not an object")
          assert.hasAllKeys(res.body, ["version"], "body does not have the required keys")
          assert.typeOf(res.body.version, "string", "version is not a string")
          done()
        })
    })
  })
  
})

after(function(){
  requester.close()
})