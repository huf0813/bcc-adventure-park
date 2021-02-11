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
        },
        '4xx':{
          type: 'object',
          required: ['message', 'error'],
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
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
          required: ['id'],
          properties: {
            id: { type: 'number' }
          }
        },
        '4xx':{
          type: 'object',
          required: ['message', 'error'],
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (req, rep) => {
      const insertedPark = await parkService.addPark(req.body)
      rep.send({ ...insertedPark })
    }
  })
  
  fastify.route({
    method: 'GET',
    url: '/:id/visit',
    schema: {
      response: {
        200: {
          type: 'object',
          required: ['balance', 'message'],
          properties: {
            message: { type: 'string' },
            balance: {
              type: 'object',
              properties: {
                spent: { type: 'number' },
                current: { type: 'number' }
              }
            }
          }
        },
        '4xx':{
          type: 'object',
          required: ['message', 'error'],
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: fastify.auth([
      fastify.verifyToken
    ]),
    handler: async (req, rep) => {
      if(isNaN(parseInt(1))){
        rep.code(400)
        rep.send({
          error: "Bad Request",
          message: "Park ID should be a number"
        })
      }
      console.log("req visit")

      try {
        const finalBalance = await parkService.visitPark(req.params.id, req.session.id)
        rep.send({
          message: "Have fun :D",
          ...finalBalance
        })
      } catch (e){
        if(e.name == "VISIT_INSUFFICIENT_BALANCE"){
          rep.code(403)
          rep.send(e)
        } else {
          rep.code(500)
          rep.send(e)
        }
      }
    }
  }) 

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
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
        },
        '4xx':{
          type: 'object',
          required: ['message', 'error'],
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (req, rep) => {
      if(isNaN(parseInt(req.params.id))){
        rep.code(400)
        rep.send({
          error: "Bad Request",
          message: "Park ID should be a number"
        })
      }

      const park = await parkService.getParkById(parseInt(req.params.id))
      if(park == null){
        rep.code(404)
        rep.send({
          error: "Not Found",
          message: "Park with id " + req.params.id + " doesn't exist"
        })
      }

      rep.send({
        ...park
      })
    }
  })

  fastify.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      body: {
        type: 'object',
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
            name: { type: 'string' },
            details: { type: 'string' },
            entranceFee: { type: 'number' }
          }
        },
        '4xx':{
          type: 'object',
          required: ['message', 'error'],
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (req, rep) => {
      if(isNaN(parseInt(req.params.id))){
        rep.code(400)
        rep.send({
          error: "Bad Request",
          message: "Park ID should be a number"
        })
      }

      const success = await parkService.editParkById(req.params.id, req.body)
      if(!success){
        rep.code(404)
        rep.send({
          error: "Not Found",
          message: "Park with id " + req.params.id + " doesn't exist"
        })
      }
      
      rep.send({ ...req.body })
    }
  })

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: "string" }
          }
        },
        '4xx':{
          type: 'object',
          required: ['message', 'error'],
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (req, rep) => {
      if(isNaN(parseInt(req.params.id))){
        rep.code(400)
        rep.send({
          error: "Bad Request",
          message: "Park ID should be a number"
        })
      }

      const success = await parkService.deleteParkById(parseInt(req.params.id))
      if(!success){
        rep.code(404)
        rep.send({
          error: "Not Found",
          message: "Park with id " + req.params.id + " doesn't exist"
        })
      }

      rep.send({
        message: "success"
      })
    }
  })

  
}
