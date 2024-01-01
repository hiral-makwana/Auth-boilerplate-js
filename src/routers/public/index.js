const express = require('express');
const authRoutes = require('./auth.route');
const routes = express.Router()

routes.use('/', authRoutes)

module.exports = routes;