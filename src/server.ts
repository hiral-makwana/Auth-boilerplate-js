/**
 * @file server.ts
 * @description Main file for setting up the Express server and defining routes.
 */

// Import necessary modules: 'express', 'Sequelize', 'http', and functions from './index'
import express, { Express } from 'express';
import Sequelize from 'sequelize';
import http from 'http';
import {
    createModel,
    getModels,
    createRoutes,
    swaggerRoute,
    updateEmailConfig,
    initEmail,
    profileUpload,
    createUploader
} from './app';

// Create a new Sequelize instance for database connection
const sequelize = new Sequelize.Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.HOST,
    logging: false
}); // Dynamic mysql configurations

// Authenticate the Sequelize instance
sequelize.authenticate().then(() => {
    console.log("Db Connected");
}).catch((err) => {
    console.log("Db Error", err.message);
});

/** Model creation */
// Create the 'users' model with specified attributes
let createModeldata = createModel('users', sequelize, {});

// Create an Express application
const app: Express = express();

// Custom validator configuration
const customValidator = {
    validator: true
};

// Create routes based on the custom validator configuration
const router = createRoutes();
app.use('/', router);

// Use the swaggerRoute for API documentation
app.use('/', swaggerRoute);

// Configure file upload using multer
const upload = createUploader({ uploadFolder: 'src/pictures/' });
app.use('/src/pictures/', express.static(__dirname + '/pictures/'));
app.post('/upload/:userId', upload, profileUpload);

// Define a simple root route
app.get('/', (req, res) => {
    res.send({
        status: true,
        message: "Hello! there.."
    });
});

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Start the server on port 7000
const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`Server is started on port:`, port);
});

let d = initEmail();