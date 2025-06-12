const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  img: String 
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
