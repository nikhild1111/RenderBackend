// routes/cartRoutes.js
const express = require('express');
const Cart = require('../models/Cart');
const { auth, isAdmin } = require("../middlewares/auth");
const Product = require('../models/Product');


const router = express.Router();

// // Save or update cart this will be to override the cart ok 
router.post('/save', auth, async (req, res) => {
  const { items, totalItems, totalPrice } = req.body;
  const userId = req.user.id;
  // id is coem fromthe mongoose so schema so dont use the _ as its a strign form



   // Map items to match schema
    const cartItems = items.map(item => ({
      productId: item._id, // from frontend
      count: item.count,
      price: item.price,
    }));

// console.log(cartItems);

  try {
    const existingCart = await Cart.findOne({ userId });

    if (existingCart) {
      existingCart.items = cartItems;
      existingCart.totalItems = totalItems;
      existingCart.totalPrice = totalPrice;
      await existingCart.save();
    } else {
      await Cart.create({userId,
        items: cartItems,
        totalItems,
        totalPrice, });
    }

  
    const detailedItems = await Promise.all(
  savedCart.items.map(async item => {
    const product = await Product.findById(item.productId);

    const availableQuantity = product.quantity - item.count; // ✅ remaining stock


// ✅ 1. ...product.toObject()
// This spreads all fields of the product (like _id, title, brand, image, description, etc.) into a new plain JavaScript object.
// ✅ 2. quantity, price are overwritten
// The original quantity from DB (like 10) is replaced by:
// quantity = product.quantity - item.count  // remaining
// price = item.price  // price stored in cart
// 
// ✅ 3. map(...) returns an array of these modified product objects
// So detailedItems becomes something like:



    return {
      ...product.toObject(),
      count: item.count,              // how many user added
      quantity: availableQuantity,    // how much is left in stock
      price: item.price               // price when user added it to cart
    };
  })
);

res.status(200).json({
  success: true,
  message: 'Cart saved successfully',
  items: detailedItems,
  totalItems: savedCart.totalItems,
  totalPrice: savedCart.totalPrice
});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});




// this will help to mearge the product in the cart even if the user is not login when the user will login he will see the product which he added 

// ❌ Problem 2: You're saving totals from frontend in new cart creation
// When existingCart is not found, you're still trusting totalItems and totalPrice from req.body, which can be incorrect or manipulated.

// ✅ Fix: Always calculate totalItems and totalPrice on the server using .reduce().
router.post('/savelogin', auth, async (req, res) => {
  const { items, totalItems, totalPrice } = req.body;
  const userId = req.user.id;

console.log("backend me he ",items);

  try {
    const existingCart = await Cart.findOne({ userId });
       let savedCart;

    if (existingCart) {
      const itemMap = {};

      // Add existing items
      existingCart.items.forEach(item => {
        itemMap[item.productId.toString()] = {
          productId: item.productId.toString(),
          count: item.count,
          price: item.price
        };
      });

      // Merge new items
      items.forEach(item => {
        const id = item._id;

        if (itemMap[id]) {
          itemMap[id].count += item.count; // merge count
          itemMap[id].price = item.price; // overwrite with latest price
        } else {
          itemMap[id] = {
            productId: id,
            count: item.count,
            price: item.price
          };
        }
      });

      // Convert to array
      const mergedItems = Object.values(itemMap);

      // console.log(mergedItems,"mearge val he ");

      // Correctly calculate totals
      const updatedTotalItems = mergedItems.reduce((sum, item) => sum + item.count, 0);
      const updatedTotalPrice = mergedItems.reduce((sum, item) => sum + item.count * item.price, 0);

      // Save updates

      console.log(updatedTotalItems)
      console.log(updatedTotalPrice)
      existingCart.items = mergedItems;
      existingCart.totalItems = updatedTotalItems;

      existingCart.totalPrice = updatedTotalPrice;

      savedCart = await existingCart.save();

    } else {
      // New cart
      const cartItems = items.map(item => ({
        productId: item._id,
        count: item.count,
        price: item.price
      }));

      const calcTotalItems = cartItems.reduce((sum, item) => sum + item.count, 0);
      const calcTotalPrice = cartItems.reduce((sum, item) => sum + item.count * item.price, 0);

    savedCart =   await Cart.create({ userId, items: cartItems, totalItems: calcTotalItems, totalPrice: calcTotalPrice });
    }


// ✅ Why Promise.all?
// Since we are using await inside .map(), all findById calls are async.
// So we wrap them with Promise.all(...) to wait for all of them to finish before returning detailedItems.


    const detailedItems = await Promise.all(
  savedCart.items.map(async item => {
    const product = await Product.findById(item.productId);

    const availableQuantity = product.quantity - item.count; // ✅ remaining stock

    return {
      ...product.toObject(),
      count: item.count,              // how many user added
      quantity: availableQuantity,    // how much is left in stock
      price: item.price               // price when user added it to cart
    };
  })
);

res.status(200).json({
  success: true,
  message: 'Cart saved successfully',
  items: detailedItems,
  totalItems: savedCart.totalItems,
  totalPrice: savedCart.totalPrice
});

  } catch (err) {
    console.error("Save cart failed:", err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});


// Get user's cart
router.get('/', auth, async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    res.json(cart || { items: [], totalItems: 0, totalPrice: 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    await Cart.deleteOne({ userId });
    res.status(200).json({ 
        success: true,
      message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
