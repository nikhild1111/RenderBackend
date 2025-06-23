const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

const Order = require('../models/Order');
const User = require('../models/UserData');

const mailSender =require('../utils/mailSender')

const delteproductordercansal = require('../utils/emailTemplates/delteproductordercansal');

// ✅ Add Product
exports.addProduct = async (req, res) => {
  try {
    const { title, description, price,discount, quantity, type, brand } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    const product = new Product({
      title,
      description,
      price,
      quantity,

      type,
      brand,
      discount,
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
// exports.getAllProducts = async (req, res) => {
//   try {
//     const {
//       keyword = "",
//       type = "",
//       brands = [],
//       priceRange = "",
//       page = 1,
//       limit = 12
//     } = req.body;

//     // 🔄 Handle brands: convert string or array into clean array
//     let parsedBrands = [];
//     if (brands) {
//       if (typeof brands === 'string') {
//         try {
//           parsedBrands = JSON.parse(brands);
//         } catch {
//           parsedBrands = brands.includes(',')
//             ? brands.split(',').map(b => b.trim())
//             : [brands.trim()];
//         }
//       } else if (Array.isArray(brands)) {
//         parsedBrands = brands.filter(b => b && b.trim());
//       }
//     }

//     // 📦 Build MongoDB query
//     const query = {};

//     // 🔍 Smart keyword search across multiple fields
//     if (keyword && keyword.trim()) {
//       const trimmedKeyword = keyword.trim();
//       const regEx = new RegExp(trimmedKeyword, 'i');
//       const keywordNumber = Number(trimmedKeyword);
//       const isNumeric = !isNaN(keywordNumber);

//       query.$or = [
//         { title: regEx },
//         { description: regEx },
//         { brand: regEx },
//         { type: regEx },                      // ✅ Partial type match via regex
//         ...(isNumeric ? [{ price: keywordNumber }] : [])
//       ];
//     }

//     // ✅ Apply 'type' filter only if provided explicitly (from dropdown etc.)
//     if (type && type.trim()) {
//       query.type = type.trim();
//     }

//     // ✅ Apply brand filter
//     if (parsedBrands.length > 0) {
//       query.brand = { $in: parsedBrands };
//     }

//     // ✅ Apply price range
//     if (priceRange && !isNaN(priceRange)) {
//       query.price = { $lte: parseInt(priceRange) };
//     }

//     // 🧮 Pagination
//     const skip = (page - 1) * limit;
//     const parsedLimit = parseInt(limit);

//     const products = await Product.find(query).skip(skip).limit(parsedLimit);
//     const totalProducts = await Product.countDocuments(query);
//     const totalPages = Math.ceil(totalProducts / parsedLimit);

//     console.log("Final MongoDB query:", JSON.stringify(query, null, 2));
//     console.log(`Found ${totalProducts} products`);

//     res.status(200).json({
//       success: true,
//       data: products,
//       currentPage: parseInt(page),
//       totalPages,
//       totalProducts,
//       appliedFilters: {
//         keyword,
//         type,
//         brands: parsedBrands,
//         priceRange,
//         page,
//         limit
//       }
//     });

//   } catch (error) {
//     console.error('Error in getProducts:', error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching products",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };


// ✅ Get All Products with Enhanced Filtering
exports.getAllProducts = async (req, res) => {
  try {
    const {
      keyword = "",
      type = "",
      brands = [],
      priceRange = "",
      page = 1,
      limit = 12,
      sortBy = "createdAt",      // Default sort
      sortOrder = "desc",        // asc or desc
      minRating,
      inStock,
      minDiscount
    } = req.body;

    // 🔄 Handle brands: convert string or array into clean array
    let parsedBrands = [];
    if (brands) {
      if (typeof brands === 'string') {
        try {
          parsedBrands = JSON.parse(brands);
        } catch {
          parsedBrands = brands.includes(',')
            ? brands.split(',').map(b => b.trim())
            : [brands.trim()];
        }
      } else if (Array.isArray(brands)) {
        parsedBrands = brands.filter(b => b && b.trim());
      }
    }

    // 📦 Build MongoDB query
    const query = {};

    // 🔍 Smart keyword search across multiple fields
    if (keyword && keyword.trim()) {
      const trimmedKeyword = keyword.trim();
      const regEx = new RegExp(trimmedKeyword, 'i');
      const keywordNumber = Number(trimmedKeyword);
      const isNumeric = !isNaN(keywordNumber);

      query.$or = [
        { title: regEx },
        { description: regEx },
        { brand: regEx },
        { type: regEx },
        ...(isNumeric ? [{ price: keywordNumber }] : [])
      ];
    }

    // ✅ Category/type filter
    if (type && type.trim()) {
      query.type = type.trim();
    }

    // ✅ Brand filter
    if (parsedBrands.length > 0) {
      query.brand = { $in: parsedBrands };
    }

    // ✅ Price range (upper limit)
    if (priceRange && !isNaN(priceRange)) {
      query.price = { $lte: parseInt(priceRange) };
    }

    // ✅ Minimum rating
    if (minRating && !isNaN(minRating)) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // ✅ In stock only
    if (inStock !== undefined) {
      if (inStock === true || inStock === 'true') {
        query.inStock = true;
      } else if (inStock === false || inStock === 'false') {
        query.inStock = false;
      }
    }

    // ✅ Minimum discount filter
    if (minDiscount && !isNaN(minDiscount)) {
      query.discount = { $gte: parseFloat(minDiscount) };
    }

    // 🧮 Pagination setup
    const skip = (page - 1) * limit;
    const parsedLimit = parseInt(limit);

    // 📊 Sort setup
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // 📦 Get products and total count
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parsedLimit);

    const totalProducts = await Product.countDocuments(query);
    
    const Totalprodcuts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / parsedLimit);

    console.log("Final MongoDB query:", JSON.stringify(query, null, 2));
    console.log(`Found ${Totalprodcuts} products`);

    // 📤 Send response
    res.status(200).json({
      success: true,
      data: products,
      currentPage: parseInt(page),
      totalPages,
      Totalprodcuts,
      appliedFilters: {
        keyword,
        type,
        brands: parsedBrands,
        priceRange,
        page,
        limit,
        sortBy,
        sortOrder,
        minRating,
        inStock,
        minDiscount
      }
    });

  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

    // ✅ Find related orders
    const orders = await Order.find({ productId: id }).populate('userId');

    // ✅ Send email to each user
    for (const order of orders) {
      const user = order.userId;

      // Guard: skip if no user
      if (!user || !user.email) continue;

      const htmlTemplate = delteproductordercansal({
        user,
        productTitle: order.title || product.title,
        order,
      });

      await mailSender(
        user.email,
        `Order Cancelled: ${order.title}`,
        `Your order for ${order.title} has been cancelled.`,
        htmlTemplate
      );
    }

    // ✅ Notify admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    await mailSender(
      adminEmail,
      `Product Deleted & ${orders.length} Orders Cancelled`,
      `Product "${product.title}" was deleted and ${orders.length} associated orders were cancelled.`
    );

    // ✅ Delete all related orders
    await Order.deleteMany({ productId: id });

    // ✅ Delete product image
    const imagePath = path.join(__dirname, '..', 'public', product.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    // ✅ Delete the product
    await Product.deleteOne({ _id: id });

    res.json({ message: 'Product and related orders deleted successfully' });
  } catch (err) {
    console.error('Error deleting product and orders:', err);
    res.status(500).json({ error: 'Failed to delete product and related orders' });
  }
};