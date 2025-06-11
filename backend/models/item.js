const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
