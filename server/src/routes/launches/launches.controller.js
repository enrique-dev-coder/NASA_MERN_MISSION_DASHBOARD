const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.model.js');

function httpGetAllLaunches(req, res) {
  // debido a que un map no esta en json solo se mandan llamar sus valores
  // y con el array from se hace un array con los valores de ese map osea un array de objetos
  return res.status(200).json(getAllLaunches());
}

function httpPostNewLaunch(req, res) {
  // el req.body saledel middleware app.use(express.json());
  // entonces cuando le mandas por un post los campos vienen en un req.body
  const launch = {
    ...req.body,
    launchDate: new Date(req.body.launchDate),
  };
  // small validation for showing the list of missing fields
  // TODO : validate for typeof data with external package or some utils.js functions made by me
  const missingFields = [];
  if (!launch.mission) missingFields.push('mission');
  if (!launch.rocket) missingFields.push('rocket');
  if (!launch.launchDate) missingFields.push('launchDate');
  if (!launch.destination) missingFields.push('destination');

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing fields: ${missingFields.join(', ')}` });
  }
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  // get the params of a req url
  const launchId = Number(req.params.id);
  if (!existsLaunchWithId(launchId)) {
    // if launch doesnt exist
    return res.status(400).json({
      error: 'Launch does not exist',
    });
  }
  const aborted = abortLaunchById(launchId);
  // if launch does exist
  return res.status(200).json(aborted);
}
module.exports = {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpAbortLaunch,
};
