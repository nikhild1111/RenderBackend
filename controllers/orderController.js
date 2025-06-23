

// ======================
// controllers/orderController.js
// ======================



const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/UserData');
const orderFailedTemplate = require('../utils/emailTemplates/orderFailed');
const Product = require('../models/Product');
const mailSender = require("../utils/mailSender");
const { orderConfirmationTemplate } = require("../utils/emailTemplates/OrderConfirmTemplates");
const { v4: uuidv4 } = require('uuid');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ----------------------
// Create Razorpay Order
// ----------------------
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const userId = req.user.id;
      console.log("🛒 Incoming cartItems:", totalAmount);

    const options = {
      amount: Math.round(totalAmount * 100), // paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(options);
    const paymentGroupId = uuidv4();



      res.status(200).json({
      success: true,
      razorpayOrder: razorpayOrder,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      paymentGroupId
    });

  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// --------------------
// Verify Payment
// --------------------
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    if (expectedSignature === razorpay_signature) {
       res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      method: paymentDetails.method,
      email: paymentDetails.email,
      contact: paymentDetails.contact,
    });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// --------------------
// Confirm Order
// --------------------
// exports.confirmOrder = async (req, res) => {
//   try {
//     const { cartItems, shippingAddress, totalAmount, shipping, paymentInfo } = req.body;
//     const userId = req.user.id;
//  if (!userId)  throw new Error(`User not found: ${userId}`);
//     const orderPromises = cartItems.map(async item => {
//       const productId = item.productId || item._id;
//       const product = await Product.findById(productId);
//       if (!product) throw new Error(`Product not found: ${productId}`);

//       const order = new Order({
//         userId,
//         productId: product._id,
//         title: product.title,
//         count: item.count,
//         price: item.price,
//         discount: item.discount || 0,
//         shipping: shipping || 0,
//         shippingAddress,
//         totalAmount: (item.price - (item.discount || 0)) * item.count + (shipping || 0),
//         paymentInfo: {
//           paymentGroupId: paymentInfo.paymentGroupId,
//           method: paymentInfo.method,
//           status: paymentInfo.status,
//           transactionId: paymentInfo.paymentId,
//           razorpayOrderId: paymentInfo.orderId,
//           razorpayPaymentId: paymentInfo.paymentId,
//           razorpaySignature: paymentInfo.signature,
//           paymentDate: new Date(),
//         },
//         orderStatus: "pending"
//       });

//       return order.save();
//     });

//     const savedOrders = await Promise.all(orderPromises);



//     // ✅ Update user's totalSpends and totalOrders here we consider only the product not its count ok 
//     const orderCount = savedOrders.length;
//     const spendAmount = savedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

//     await User.findByIdAndUpdate(
//       userId,
//       {
//         $inc: {
//           totalOrders: orderCount,
//           totalSpends: spendAmount
//         }
//       }
//     );

//     // ✅ Send Email
//     await mailSender(
//       req.user.email,
//       "🛒 Order Confirmation - ECOMZY",
//       "Your order has been placed successfully.",
//       orderConfirmationTemplate({
//         userName: req.user.name || "Customer",
//         orders: savedOrders,
//         totalAmount,
//       })
//     );

//     res.status(201).json({ success: true, message: "Order confirmed and saved." });

//   } catch (error) {
//     console.error("Confirm order error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };



exports.confirmOrder = async (req, res) => {
  try {
    const { cartItems, shippingAddress, totalAmount, shipping, paymentInfo } = req.body;
    const userId = req.user.id;

    if (!userId) throw new Error("User not found.");

    const orderDocs = [];

    // Prepare orders in-memory first
    for (let item of cartItems) {
      const productId = item.productId || item._id;
      const product = await Product.findById(productId);
      if (!product) throw new Error(`Product not found: ${productId}`);

      orderDocs.push({
        userId,
        productId: product._id,
        title: product.title,
        count: item.count,
        price: item.price,
        discount: item.discount || 0,
        shipping: shipping || 0,
        shippingAddress,
        totalAmount: (item.price - (item.discount || 0)) * item.count + (shipping || 0),
        paymentInfo: {
          paymentGroupId: paymentInfo.paymentGroupId,
          method: paymentInfo.method,
          status: paymentInfo.status,
          transactionId: paymentInfo.paymentId,
          razorpayOrderId: paymentInfo.orderId,
          razorpayPaymentId: paymentInfo.paymentId,
          razorpaySignature: paymentInfo.signature,
          paymentDate: new Date(),
        },
        orderStatus: "pending",
      });
    }

    let savedOrders;

    try {
      // Save all orders together - atomic
      savedOrders = await Order.insertMany(orderDocs);
    } catch (insertError) {
      console.error("⚠️ Order insert failed:", insertError);

      // Send fallback mail to user
      await mailSender(
        req.user.email,
        "❌ Order Failed - ECOMZY",
        "Your payment succeeded but the order couldn't be placed.",
        orderFailedTemplate({
          user: req.user,
          cartItems,
          paymentInfo
        })
      );

      return res.status(500).json({
        success: false,
        message: "Order failed. Refund will be initiated shortly.",
      });
    }

    // ✅ Update user info
    const orderCount = savedOrders.length;
    const spendAmount = savedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

console.log(spendAmount);
console.log(orderCount);


 const updatedUser= await User.findByIdAndUpdate(userId, {
      $inc: {
        totalOrders: orderCount,
        totalSpends: spendAmount,
      },
    },
        { new: true } // This option returns the updated document
        // new: true makes sure that the returned updatedUser is the one after the update.
    );


    if (!updatedUser) {
  return res.status(404).json({ success: false, message: "User not found." });
}

 

    // ✅ Send order confirmation mail
    await mailSender(
      req.user.email,
      "🛒 Order Confirmed - ECOMZY",
      "Your order is confirmed.",
      orderConfirmationTemplate({
        userName: req.user.name || "Customer",
        orders: savedOrders,
        totalAmount,
      })
    );

    res.status(200).json({
      success: true,
      message: "Order confirmed successfully.",
      orders: savedOrders,
      totalOrders:updatedUser.totalOrders,
      totalSpends:updatedUser.totalSpends
      
    });

  } catch (error) {
    console.error("❌ Confirm order error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// --------------------
// Payment Failure (Optional)
// --------------------
exports.paymentFailure = async (req, res) => {
  try {
    const { paymentGroupId, error } = req.body;
    console.warn(`Payment failed for group ${paymentGroupId}:`, error);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// module.exports = {
//   createRazorpayOrder ,
//   verifyPayment,
//   confirmOrder,
//   paymentFailure
// };
































// *********************************///////////////title

// GET /api/orders - Admin: Get all orders
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("userId", "name email")
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: "Admin fetch failed", error: err.message });
//   }
// };









//this was the first one
// PATCH /api/orders/:id/status - Admin: Update order status
// const updateOrderStatus = async (req, res) => {
//   try {
//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     );
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: "Update failed", error: err.message });
//   }
// };

// ✅ Option 1: The One You're Using ($set + items.$.status)
// This is best when you only want to update one specific item inside an array.

// Already explained above.

// const  updateOrderStatus = async (req, res) => {

//   const { orderId, itemId } = req.params;
//   const { status } = req.body;

//   try {
//     const order = await Order.findOneAndUpdate(
//       { _id: orderId, "items._id": itemId },
//       { $set: { "items.$.status": status } },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ message: "Order or Item not found" });
//     }

//     res.json({ message: "Item status updated", order });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed", error: err.message });
//   }
// };

// 🔁 Option 2: Fetch → Modify in JS → Save



















// ''''''''''''''''''''''''''''

// const updateOrderStatus = async (req, res) => {
//   const { orderId, itemId } = req.params;
//   const { status } = req.body;

//   try {
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const item = order.items.id(itemId); // Or use String(itemId) for safety

//     if (!item) {
//       return res.status(404).json({ message: "Item not found" });
//     }

//     item.status = status;
//     await order.save();

//     res.json({ message: "Item status updated", order });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed", error: err.message });
//   }
// };




// // Export all controller functions
// module.exports = {
//   createOrder,
//   getUserOrders,
//   getAllOrders,
//   updateOrderStatus,
// };
