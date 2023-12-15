import swaggerJsdoc from 'swagger-jsdoc';

let definition: any;

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
            url: process.env.DEFAULT,
        },
        {
            url: process.env.SWAGGER,
        },
    ]
}
const options = {
    definition,
    apis: ['./src/**/*.ts'],
};
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
