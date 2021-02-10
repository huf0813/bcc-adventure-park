const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;

chai.use(chaiHttp)
const db = require('../src/utils/db')

function assertIsValidFullParkObject(park){
  assert.isObject(park, "park is not an object")
  assert.hasAllKeys(park, ["id", "name", "details", "entranceFee"], "park object doesn't have the required keys")
  assert.typeOf(park.id, "number", "id is not a number")
  assert.typeOf(park.name, "string", "name is not a string")
  assert.typeOf(park.details, "string", "details is not a string")
  assert.typeOf(park.entranceFee, "number", "entranceFee is not a number")
}

const dummyPark = { name: "Integration Testing Park #1", details: "Integration Testing Park #1", entranceFee: 420360 }
function assertDummyPark(park){
  assertIsValidFullParkObject(park)
  assert.isNumber(park.id, "id should be generated and be a number")
  assert.equal(park.name, "Integration Testing Park #1", "name is not the same as provided")
  assert.equal(park.details, "Integration Testing Park #1", "details is not the same as provided")
  assert.equal(park.entranceFee, 420360, "entranceFee is not the same as provided")
}

describe("/park endpoint", function () {
  before(function(done) {
    db('parks').delete().then(() => done())
  })

  describe('POST /park, insert a new park with full information', function(){
    before(function(done){
      this.requester.post('/park')
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

    it('should return a full park object with the information provided', function(done){
      assertDummyPark(this.requestResult.body)
      done()
    })
  })

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
      await this.requester.post("/park").send(dummyPark).then((res, err) => {
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

  after(function(done){
    db('parks').delete().then(() => done())
  })
})
