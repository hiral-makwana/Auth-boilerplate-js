/**
 * @file server.ts
 * @description Main file for setting up the Express server and defining routes.
 */
// import necessary modules: 'express', 'Sequelize', 'http', and functions from './index'
const express = require('express');
const http = require('http');
const apiRoutes = require('./routers/index.route')
const swaggerRoute = require('./routers/swaggerRoute')
const config = require('./config/config.json');
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

// Create routes based on the custom validator configuration
app.use('/', apiRoutes, swaggerRoute);

//** Handle error message */
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
const port = config.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is started on port:`, port);
});
