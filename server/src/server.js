// usar variables de entorno del .env
require('dotenv').config();
////////////////////////////
const http = require('http');
const app = require('./app');
const PORT = process.env.PORT;

const { loadPlanetsData } = require('./models/planets.model.js');
const { loadSpacexLaunchDataToOurDB } = require('./models/launches.model.js');
const { connectToMongoDB } = require('./services/mongo.js');

// this is to separate express code like middlewares form the file of the server
// aside its better to start the server with http native module for websockets
// express acts like a middleware for every http request
const server = http.createServer(app);

// common pattern used to load functions before server starts, like review services or mount a data base etc

async function startServer() {
  await connectToMongoDB();
  await loadPlanetsData();
  await loadSpacexLaunchDataToOurDB();

  server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

startServer();
