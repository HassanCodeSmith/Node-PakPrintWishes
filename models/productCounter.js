const mongoose = require('mongoose');

const productIdCounterSchema = new mongoose.Schema({
  value: {
    type: Number,
    default: 1, 
  },
});

const ProductIdCounter = mongoose.model('ProductIdCounter', productIdCounterSchema);

module.exports = ProductIdCounter;
