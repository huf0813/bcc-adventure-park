const userService = require('../services/user')
const authService = require('../services/auth')

module.exports = async (fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/register',
    schema: {
      body: {
        type: 'object',
        required: ['email', 'pass'],
        properties: {
          email: { type: 'string' },
          pass: { type: 'string' },
          name: { type: 'string' },
          token: { type: 'boolean' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: "string" },
            id: { type: "number" },
            token: { type: "object", properties: {
              token: { type: "string" },
              expiresAt: { type: "number" }
            } }
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
      try {
        const generateToken = req.body.token
        delete req.body.token
        const userId = await userService.addUser(req.body)
        if(generateToken){
          const token = await authService.generateToken(userId)
          rep.send({
            message: "success",
            id: userId,
            token: token
          })
        }
        rep.send({ message: "success", id: userId })
      } catch (e) {
        rep.code(403)
        rep.send({ error: "EMAIL_EXISTS", message: "A user with that email already exists"})
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            name: { type: 'string' },
            level: { type: 'string' },
            balance: { type: 'number'}
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
      const user = await userService.getUserById(req.session.id)
      rep.send(user)
    }
  })

  fastify.route({
    method: 'GET',
    url: '/balance',
    schema: {
      response: {
        200: {
          type: "object",
          required: ["balance"],
          properties: {
            balance: { type: "number" }
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
      rep.send({ balance: (await userService.getUserById(req.session.id)).balance })
    }
  })

  fastify.route({
    method: 'POST',
    url: '/balance',
    schema: {
      body: {
        type: 'object',
        required: ['balance'],
        properties: {
          balance: { type: "number" }
        }
      },
      response: {
        200: {
          type: "object",
          required: ["balance"],
          properties: {
            balance: { type: "number" }
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
      await userService.setUserBalance(req.session.id, req.body.balance)
      rep.send({ balance: req.body.balance })
    }
  })
}
