/**
 * @file server.ts
 * @description Main file for setting up the Express server and defining routes.
 */
// import necessary modules: 'express', 'Sequelize', 'http', and functions from './index'
const express = require('express');
const http = require('http');
const apiRoutes = require('./routers/index.route')
const swaggerRoute = require('./routers/swaggerRoute')
require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const i18n = require('./helper/i18n');
const handleErrorMessage = require('./middleware/validatorMessage');
const db = require('./models/index');

db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });
// Create an Express application
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(i18n.init);
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Expose-Headers', 'Download-File')
    next();
});

// Create routes based on the custom validator configuration
app.use('/', apiRoutes, swaggerRoute);
app.set('trust proxy', true);
// //** Handle error message */
app.use(handleErrorMessage)
app.use('/src/pictures/', express.static(__dirname + '/pictures/'));

// Define a simple root route
app.get('/', (req, res) => {
    res.send({
        status: true,
        message: "Hello! there.."
    });
});

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is started on port:`, port);
});
