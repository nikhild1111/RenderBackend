// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
// const path = require('path');
// const Product = require('../models/Product');

// //  to add the product in the databse

// // Ensure upload directory exists
// const uploadPath = path.join(__dirname, '..', 'public/uploads');
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }


// // here we are using the disk storage to store the file becuase if we not use it then we can store the  file in upload using the  upload-multer({dest:"public/uploads"}) but it will store the ile but we cant read it so we can say that fiel is coreupt so to costomizably stor ethe fiel we use the disstorage funtion

// // // Multer storage config
// // 🔍 Purpose of multer.diskStorage({ ... })
// // This function is used to customize where and how the uploaded files should be stored on your server.
// const storage = multer.diskStorage({
//   // its an funtion wich tells where we has to add the file req object is same whcih we give file also anfd the cd is callback funtion
//   destination: function (req, file, cb) {
//     // here in cd first argument is the error if we want to throw and the secodn one is the destination path where this fiel shoud be store 
//     cb(null, uploadPath);
//   },

//   // here we are giving the uniuse fiel name to each file using Date.now() so no same fiel name and we creted the storage
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage });

// // Route: Add Product
// // here we can aslo add the multiple file or images as well we just nee ot metion  upload.array('photos', 5) // This will handle multiple files uploaded with the field name 'photos'.
// //or we can also use this for the mutiple storage  upload.fields([
// //   { name: 'avatar', maxCount: 1 },
// //   { name: 'gallery', maxCount: 5 }
// // ])
// router.post('/add', upload.single('image'), async (req, res) => { 
//   try {
//     const { title, description, price, quantity, type ,brand} = req.body;

//     // Check if image file was uploaded
//     if (!req.file) {
//       return res.status(400).json({ error: 'Image is required' });
//     }

    
//     const image = '/uploads/' + req.file.filename;

//     const product = new Product({
//       id: uuidv4(), // Unique ID
//       title,
//       description,
//       price,
//       quantity,
//       type,
//       brand,
//       image
//     });

//     await product.save();
//     res.status(201).json({ message: 'Product added successfully' });
//   } catch (err) {
//     console.error('Error adding product:', err);
//     res.status(500).json({ error: 'Failed to add product' });
//   }
// });

// // Route: Get All Products
// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     console.error('Error fetching products:', err);
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
} = require('../controlers/productController1');



const { auth, isAdmin } = require("../middlewares/auth");



// Multer Storage Config
const uploadPath = path.join(__dirname, '..', 'public/uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post('/add',auth, isAdmin, upload.single('image'), addProduct);
router.get('/', getAllProducts);
router.put('/update/:id', auth, isAdmin, upload.single('image'), updateProduct);
router.delete('/delete/:id', auth, isAdmin, deleteProduct);

module.exports = router;
