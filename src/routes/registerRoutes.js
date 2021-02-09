module.exports = async (fastify, opts) => {
  fastify.register(require('./root'), { prefix: '/'})
}