const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: String,
  description: String,
  price: Number,
  quantity: Number,
  image: String, // Example: "/uploads/image.jpg"
  type: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
