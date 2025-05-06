const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

// Ensure upload directory exists
const uploadPath = path.join(__dirname, '..', 'public/uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Route: Add Product
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, quantity, type } = req.body;

    // Check if image file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const image = '/uploads/' + req.file.filename;

    const product = new Product({
      id: uuidv4(), // Unique ID
      title,
      description,
      price,
      quantity,
      type,
      image
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Route: Get All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
