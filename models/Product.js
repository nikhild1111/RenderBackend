const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // id: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
    // _id: Number, // Use the API's `id` as MongoDB document _id
  title: String,
  description: String,
  price: Number,
  quantity: Number,
  image: String, // Example: "/uploads/image.jpg"
  type: String,  // 👈 product type for filtering,
  brand:String,
  count: { type: Number, default: 1 }, 
});

module.exports = mongoose.model('Product', productSchema);
