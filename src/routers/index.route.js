const express = require('express');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');

const routes = express.Router()

routes.use('/', authRoutes)

routes.use('/', userRoutes)

module.exports = routes;
