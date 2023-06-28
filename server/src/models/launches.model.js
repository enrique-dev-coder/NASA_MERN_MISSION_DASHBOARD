const launches = new Map();

let latestFlightNumber = 100;

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

launches.set(launch.flightNumber, launch);

// en  un Map se usa ese metodo para verificar si estiste
function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  // para Map solo se usa un set para agregar un valor
  latestFlightNumber++;
  launches.set(latestFlightNumber, {
    ...launch,
    succes: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
    flightNumber: latestFlightNumber,
  });
}

function abortLaunchById(launchId) {
  // para borrar el metodo launches.delete(launchId)
  // pero si queremos quedarnos con esa data mas bien se marcan esos launches como aborted y ya no se muestran en el front
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.succes = false;
  return aborted;
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
