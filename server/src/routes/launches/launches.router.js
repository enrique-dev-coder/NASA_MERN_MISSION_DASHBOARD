const express = require('express');
const {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpAbortLaunch,
} = require('./launches.controller.js');
const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpPostNewLaunch);
// give idparameter to route
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;
