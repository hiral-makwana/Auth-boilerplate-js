const swaggerJsdoc = require('swagger-jsdoc');

let definition;

definition = {
    openapi: '3.0.0',
    info: {
        title: 'Authentication-Library',
        version: '1.0.0',
        description: 'API documentation for Authentication-Library',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    servers: [
        {
            url: global.config.API_BASE_PREFIX,
        },
    ],
};

const options = {
    definition,
    apis: ['./src/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
