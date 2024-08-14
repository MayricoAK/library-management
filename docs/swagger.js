const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Library API',
        version: '1.0.0',
        description: 'A simple API for library management',
      },
      components: {
        schemas: {
          Book: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              title: { type: 'string' },
              author: { type: 'string' },
              stock: { type: 'number' },
            },
          },
          Member: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              name: { type: 'string' },
            },
          },
        },
      },
      servers: [
        {
          url: 'http://localhost:5001',
        },
      ],
    },
    apis: ['./routes/*.js'],
  };  

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};