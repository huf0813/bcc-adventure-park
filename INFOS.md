# BCC Adventure Park
---
This is my attempt for the BCC Back-End Instant Pass 2020 Challange.

This is a REST API made with [Node.js](https://nodejs.org/) with [Fastify](https://www.fastify.io/) for the web framework and [Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/) + [Chai HTTP](https://www.chaijs.com/plugins/chai-http/) for the testing framework. The documentation is in [Swagger](https://swagger.io/) format and displayed using Swagger UI via [fastify-swagger](https://github.com/fastify/fastify-swagger).

The server will normally run on `http://localhost:420`, if port 420 is not available, it will choose a random port.
For more information, you can see the docs at the `GET /docs` endpoint. The Swagger-formatted specs is available in under the `specs` directory.
---
### Commands
 - Install dependencies: `npm install`
 - Running the server: `npm start`
 - Running tests: `npm tests`
