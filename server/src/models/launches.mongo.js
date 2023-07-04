const mongoose = require('mongoose');

// un schema es la definicion del modelo , aqui lo que hacemos es decirle a mongo los tipos de datos y estrucuta que tendra nuestro modelo
const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  // aqui es solo una referencia a la tabla pero no es recomendable hacer tantas referencias con mongo db
  // entocnes esa logica se hace en el modelo
  destination: {
    type: String,
    required: false,
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model('Launch', launchesSchema);
