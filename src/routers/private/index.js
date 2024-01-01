const express = require('express');
const userRoutes = require('./user.route');

const routes = express.Router()

routes.use('/', userRoutes)

module.exports = routes;