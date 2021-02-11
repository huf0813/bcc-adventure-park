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
        const userId = await userService.addUser({ email: req.body.email, pass: req.body.pass })
        if(req.body.token){
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
}
