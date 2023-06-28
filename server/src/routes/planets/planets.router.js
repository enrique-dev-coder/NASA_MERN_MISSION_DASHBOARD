const express = require('express');
const { httpGetAllPlanets } = require('./planets.controller.js');

const planetsRouter = express.Router();

// ai yo hago esto usanod el mismo objeto que hace module.exports ya es una referencia a la funcion y no necesito envair el req,req  en un callback

planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;
