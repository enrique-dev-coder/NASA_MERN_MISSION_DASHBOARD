// all of this is to parse data from a csv  with some conditions for an habitable planet
const { parse } = require('csv-parse');
const path = require('path');
const fs = require('fs');

const planets = require('./planets.mongo.js');

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', () => {
        resolve();
      });
  });
}

async function getAllPlanets() {
  // {} todos los datos son regresados
  // el segundo argumento es para ver que campos son incluidos en la respuesta el :0 es para excluir
  // mas info en la doc de mongoose
  return await planets.find({}, { __v: 0, _id: 0 });
}

async function savePlanet(data) {
  // guardar el pnaeta en el modelo de mongodb,
  // para qeu no guarde varias veces los 8 planets por la logica de la funcion se usa una upsert operation
  // await planets.create({ keplerName: data.kepler_name });
  // esta funcion de mongoose es para que se busquen los planetas y si ya existen que NO se vuelvan a acrear
  try {
    await planets.updateOne(
      {
        keplerName: data.kepler_name,
      },
      {
        keplerName: data.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.log(`Could not save ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
