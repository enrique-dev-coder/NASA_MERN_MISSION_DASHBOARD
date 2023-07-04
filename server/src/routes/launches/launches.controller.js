const {
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
} = require('../../models/launches.model.js');

const { getPagination } = require('../../services/query.js');

async function httpGetAllLaunches(req, res) {
  // aqui vienen los params de la query http://localhost:8000/v1/launches?page=2&limit=50 todo lo que venga despues de ? y lo parsea como  {page: '2',limit:"50" }
  // esta funcion regresa un objeto
  const { skip, limit } = getPagination(req.query);
  // debido a que un map no esta en json solo se mandan llamar sus valores
  // y con el array from se hace un array con los valores de ese map osea un array de objetos
  return res.status(200).json(await getAllLaunches(skip, limit));
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

async function httpAbortLaunch(req, res) {
  // get the params of a req url
  const launchId = Number(req.params.id);
  const aborted = await abortLaunchById(launchId);
  // if launch does exist
  return res.status(200).json(aborted);
}
module.exports = {
  httpGetAllLaunches,
  httpPostNewLaunch,
  httpAbortLaunch,
};
