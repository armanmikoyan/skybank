import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0', 
    info: {
      title: 'SKYBANK API Documentation',
      version: '1.0.0',
      description: "All endpoint explanations for developers",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 6666}`,
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {  
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
      path.join(__dirname, './auth.yaml'),
      path.join(__dirname, './cards.yaml'),
      path.join(__dirname, './accounts.yaml'),
      path.join(__dirname, './transactionHistory.yaml'),
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
