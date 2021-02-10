module.exports = async (fastify, opts, done) => {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            version: { type: 'string' }
          }
        }
      }
    },
    handler: async (req, rep) => {
      rep.send({ version: require('../index').API_VERSION })
    }
  })
}
