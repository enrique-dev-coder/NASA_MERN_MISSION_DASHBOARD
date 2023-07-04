const { getAllPlanets } = require('../../models/planets.model.js');

// use return is a good practice in response

async function httpGetAllPlanets(req, res) {
  // responses with a .json for data
  return res.status(200).json(await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
