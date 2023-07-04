const axios = require('axios');
const launches = require('./launches.mongo.js');
const planets = require('./planets.mongo.js');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

// cargar data desde la api de spaceX
// se usara axios como libreria para hacer request en node

async function loadSpacexLaunchData(options = {}) {
  // segun la doc de la api se usa un post para queries mas avanzadas
  const { pagination = true } = options;

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: pagination,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  const launchDocs = response.data?.docs;

  return launchDocs;
}

// aqui podemos salvar toda la data a la base de datos(pagination false) o ir slavando pagina por pagina requerida por el usuario
// que eventualmente seria lo mismo para el caso metimos todos los datos a nuestra base de datos en mongo
async function loadSpacexLaunchDataToOurDB() {
  const launchDocs = await loadSpacexLaunchData({ pagination: false });
  const launchDocsMapped = launchDocs.map((launch) => {
    return {
      flightNumber: launch.flight_number,
      mission: launch.name,
      rocket: launch.rocket.name,
      launchDate: launch.date_local,
      upcoming: launch.upcoming,
      success: launch.success,
      // aqui usamos el trukzo del flat map para que un array de arrays [[Array]] se haga un [Array] de un solo nivel
      customers: launch.payloads.flatMap((item) => item.customers),
    };
  });

  launchDocsMapped.map(async (launch) => await saveLaunch(launch));
}

// en  un Map se usa ese metodo para verificar si estiste
async function existsLaunchWithId(launchId) {
  return await launches.findOne({ flightNumber: launchId });
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    // sortear por flightnumber ascendente
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function getLatestFlightNumber() {
  // esto  te devuelve un objeto por find one y te hace un sort con el highest fly number
  const latestLaunch = await launches.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  // vamos a agregar una validacion para simular la logica de una referencia a una foreign key de SQL
  // donde si existe el destination en la coleccion de planets entonces te deje guardar el launch

  // posible solucion usando una lista
  // if ((await planets.find({ keplerName: launch.destination })).length > 1) {
  //   await launches.updateOne(
  //     {
  //       flightNumber: launch.flightNumber,
  //     },
  //     launch,
  //     { upsert: true }
  //   );
  // } else {
  //   console.log('destination planet not found');
  // }

  //solucion usando solo el planeta como objeto solo se revisa si sale un objeto, si no se manda un error

  await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function scheduleNewLaunch(launch) {
  try {
    const planet = await planets.findOne({ keplerName: launch.destination });
    if (!planet) {
      // buenas practicas para sacar errores
      throw new Error('No destination planet found');
    }
    const newLaunch = {
      ...launch,
      success: true,
      upcoming: true,
      customers: ['ZTM', 'NASA'],
      flightNumber: (await getLatestFlightNumber()) + 1,
    };
    // verificar que todo este bien para agregar el launch
    await saveLaunch(newLaunch);
  } catch (error) {
    throw new Error('Mission could not be launched :c');
  }
}

function addNewLaunch(launch) {
  // solo se hizo esto para no renombrar todas las funciones
  scheduleNewLaunch(launch);
}

async function abortLaunchById(launchId) {
  // pero si queremos quedarnos con esa data mas bien se marcan esos launches como aborted y ya no se muestran en el front
  // encontrar el launch por el id con una funcion que ya teniamos
  const launchToBeAborted = await existsLaunchWithId(launchId);
  if (!launchToBeAborted) {
    throw new Error('Could not found launch:c');
  }
  launchToBeAborted.success = false;
  launchToBeAborted.upcoming = false;
  // salvar el launchToBeAborted con los cambios
  await launchToBeAborted.save();

  return launchToBeAborted;
}

module.exports = {
  loadSpacexLaunchDataToOurDB,
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
