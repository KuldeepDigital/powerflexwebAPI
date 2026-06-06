const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Powerflex Web API',
    description: 'API documentation for Powerflex Web API automatically generated.'
  },
  host: 'localhost:5000',
  schemes: ['http'],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const outputFile = './swagger-output.json';
// Pointing to the main entry file. swagger-autogen will trace the routes from here.
const endpointsFiles = ['./server.js'];

// Generate swagger-output.json
swaggerAutogen(outputFile, endpointsFiles, doc);
