module.exports = async (fastify, opts) => {
  fastify.register(require('./root'))
  fastify.register(require('./park'), { prefix: '/park'})
  fastify.register(require('./user'), { prefix: '/user'})
}
