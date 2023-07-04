// usar variables de entorno
require('dotenv').config();
////////////////////////////
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

// check mongo db connection
mongoose.connection.once('open', () => {
  console.log('Mongo DB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});
// conectar a mongoose antes de que inicie el server
// en la ultima version de mongoose ya te ponen por default las mejores opciones de coneccion
async function connectToMongoDB() {
  await mongoose.connect(MONGO_URL);
}

async function disconnectMongoDB() {
  await mongoose.disconnect(MONGO_URL);
}

module.exports = { connectToMongoDB, disconnectMongoDB };
