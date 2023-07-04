const express = require('express');

// routers
const planetsRouter = require('./planets/planets.router.js');
const launchesRouter = require('./launches/launches.router.js');

const api = express.Router();

// planetsRouter is an objectwith the methods like get routes
api.use('/planets', planetsRouter);
// el path que usan todas las rutas
api.use('/launches', launchesRouter);

module.exports = api;
