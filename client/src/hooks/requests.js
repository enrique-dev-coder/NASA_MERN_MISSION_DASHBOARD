const BASE_PATH = 'http://localhost:';
const PORT = 5000;
const ROUTES = {
  PLANETS: '/planets',
  LAUNCHES: '/launches',
};

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${BASE_PATH}${PORT}${ROUTES.PLANETS}`);
  return await response.json();
}

//load launches, sort by flight number
async function httpGetLaunches() {
  const response = await fetch(`${BASE_PATH}${PORT}${ROUTES.LAUNCHES}`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${BASE_PATH}${PORT}${ROUTES.LAUNCHES}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return { ok: false };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${BASE_PATH}${PORT}${ROUTES.LAUNCHES}/${id}`, {
      method: 'delete',
    });
  } catch (error) {
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };