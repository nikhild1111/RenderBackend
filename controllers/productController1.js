const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// ✅ Add Product
exports.addProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, type, brand } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    const product = new Product({
      title,
      description,
      price,
      quantity,
      type,
      brand,
      image: '/uploads/' + req.file.filename
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// ✅ Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// ✅ Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, quantity, type, brand } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', 'public', product.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      product.image = '/uploads/' + req.file.filename;
    }

    product.title = title;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.type = type;
    product.brand = brand;

    await product.save();
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const imagePath = path.join(__dirname, '..', 'public', product.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await Product.deleteOne({ _id: id });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
