const API_VERSION = "0.1.0"

const fastify = require('fastify')()

fastify.decorate('verifyToken', require('./utils/auth').verifyToken)
  .decorate('verifyEmailPassword', require('./utils/auth').verifyEmailPassword)
  .register(require('fastify-auth'))
  .after(() => {
    fastify.register(require('./routes/registerRoutes'))
  })

if(!(process.env.NODE_ENV == 'test')){
  fastify.listen(420, (err, addr) => {
    if(err){
      console.error(err)
      console.error("Will now try a random port.")
      fastify.listen(0, (err, addr) => {
        if(err){
          console.error(err)
          process.exit(1)
        }
      })
    } else {
      console.log("Server listening on " + addr)
    }
  })
}

module.exports = {
  API_VERSION,
  server: fastify
}
