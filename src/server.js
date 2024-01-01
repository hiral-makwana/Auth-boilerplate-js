/**
 * @file server.js
 * @description Main file for setting up the Express server and defining routes.
 */
// import necessary modules: 'express', 'Sequelize' etc.
const dotenv = require('dotenv');
dotenv.config()
const env = process.env.NODE_ENV || 'development'
let config = require('./config/config.json')[env];
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
global.config = config
const { privateRoutes, publicRoutes } = require('./routers/index.route')
const swaggerRoute = require('./routers/swaggerRoute')
const i18n = require('./helper/locale.helper');
const handleErrorMessage = require('./middleware/validate');
const db = require('./models/index');
const { userAuth } = require('./middleware/auth');

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

app.all('/v1/private/*', userAuth)
app.use('/v1/private', privateRoutes)
app.use('/v1/public', publicRoutes)
app.set('trust proxy', true);
app.use('/', swaggerRoute);

//** Handle error message */
app.use(handleErrorMessage)

app.use(global.config.UPLOAD_DIR, express.static(__dirname + '/uploads/'));

// Define a simple root route
app.get('/', (req, res) => {
    res.send({
        status: true,
        message: "Hello! there.."
    });
});

// Start the server
const port = global.config.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is started on port:`, port);
});

module.exports = server;