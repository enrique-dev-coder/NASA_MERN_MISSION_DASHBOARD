const { getAllPlanets } = require('../../models/planets.model.js');

// use return is a good practice in response

function httpGetAllPlanets(req, res) {
  // responses with a .json for data
  return res.status(200).json(getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
