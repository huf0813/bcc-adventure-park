const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp)

describe("/ endpoint", function () {
  describe('GET /', function(){
    before(function(done){
      this.requester.get('/')
        .end((err, res) => {
          if(err){ console.error(err) }
          this.requestResult = res
          done()    
        })
    })

    it('should return status code 200', function(done) {
      assert.equal(this.requestResult.status, 200)
      done()
    })
    it('body should only contain a version information', function(done) {
      assert.isObject(this.requestResult.body, "body is not an object")
      assert.hasAllKeys(this.requestResult.body, ["version"], "body does not have the required keys")
      assert.typeOf(this.requestResult.body.version, "string", "version is not a string")
      done()
    })
  })
})


