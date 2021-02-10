const parkService = require('../services/park')

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
      const parks = await parkService.getAllParks()
      rep.send({
        total: parks.length,
        parks: parks
      })
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
          required: ['id', 'name', 'details', 'entranceFee'],
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            details: { type: 'string' },
            entranceFee: { type: 'number' }
          }
        }
      }
    },
    handler: async (req, rep) => {
      const insertedPark = await parkService.addPark(req.body)
      rep.send({ ...insertedPark })
    }
  })
}
