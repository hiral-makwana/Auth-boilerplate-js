"use strict";
/**
 * @file server.ts
 * @description Main file for setting up the Express server and defining routes.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules: 'express', 'Sequelize', 'http', and functions from './index'
const express_1 = __importDefault(require("express"));
const sequelize_1 = __importDefault(require("sequelize"));
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
// Create a new Sequelize instance for database connection
const sequelize = new sequelize_1.default.Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
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
let createModeldata = (0, app_1.createModel)('users', sequelize, {});
// Create an Express application
const app = (0, express_1.default)();
// Custom validator configuration
const customValidator = {
    validator: true
};
// Create routes based on the custom validator configuration
const router = (0, app_1.createRoutes)();
app.use('/', router);
// Use the swaggerRoute for API documentation
app.use('/', app_1.swaggerRoute);
// Configure file upload using multer
const upload = (0, app_1.createUploader)({ uploadFolder: 'src/pictures/' });
app.use('/src/pictures/', express_1.default.static(__dirname + '/pictures/'));
app.post('/upload/:userId', upload, app_1.profileUpload);
// Define a simple root route
app.get('/', (req, res) => {
    res.send({
        status: true,
        message: "Hello! there.."
    });
});
// Create an HTTP server using the Express app
const server = http_1.default.createServer(app);
// Start the server on port 7000
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is started on port:`, port);
});
let d = (0, app_1.initEmail)();
//# sourceMappingURL=server.js.map