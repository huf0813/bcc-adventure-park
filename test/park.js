const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp)

describe("/park endpoint", function () {
  describe('GET /park, get list of parks', function(){
    before(function(done){
      this.requester.get('/')
        .end((err, res) => {
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
      assert.isObject(this.requestResult.body, "body is not an object")
      assert.hasAllKeys(this.requestResult.body, ["total", "parks"], "body does not have the required keys")
      assert.typeOf(this.requestResult.body.total, "string", "total is not a number")
      assert.isArray(this.requestResult.body.parks, "parks is not")
      done()
    })
  })

})
