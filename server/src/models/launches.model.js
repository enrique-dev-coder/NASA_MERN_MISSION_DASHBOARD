const launches = require('./launches.mongo.js');
const planets = require('./planets.mongo.js');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27,2030'),
  destination: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

// la funcion ya manda una promesa que usamos para guardar ese ejemplo como el priemr caso
saveLaunch(launch);

// en  un Map se usa ese metodo para verificar si estiste
async function existsLaunchWithId(launchId) {
  return await launches.findOne({ flightNumber: launchId });
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
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

  const planet = await planets.findOne({ keplerName: launch.destination });
  if (!planet) {
    // buenas practicas para sacar errores
    throw new Error('No destination planet found');
  }
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
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};

// un map te deja asociar un valor a cualquier otro valor por ejemplo { ()=>{}:""}
// tambien tienen un feature que hace que se preserve el orden en que se van insertando los valores a diferencia de un objeot normal de js
// launches.set(launch.flightNumber,launch) esto quiere decir que andamos creando un nuevo objeto como {100: launch}
