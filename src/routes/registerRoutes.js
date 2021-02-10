module.exports = async (fastify, opts) => {
  fastify.register(require('./root'), { prefix: '/'})
  fastify.register(require('./park'), { prefix: '/park'})
}
