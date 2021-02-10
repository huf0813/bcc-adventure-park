const { default: fastify } = require("fastify");

module.exports = async (fastify, opts, done) => {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            parks: { type: 'array' }
          }
        }
      }
    },
    handler: async (req, rep) => {

    }
  })

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          details: { type: 'string' },
          entranceFee: { type: 'number' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            parks: { type: 'array' }
          }
        }
      }
    },
    handler: async (req, rep) => {
      
    }
  })
}
