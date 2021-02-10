const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index').server;
chai.use(chaiHttp)

let requester

before(async function(){
 this.requester = chai.request(await server.listen(0)).keepOpen()
})

after(function(){
  this.requester.close()
})

module.exports = requester