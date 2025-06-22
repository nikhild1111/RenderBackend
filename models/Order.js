// const mongoose = require("mongoose");
// const orderSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     items: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         name: String,
//         count: {
//           type: Number,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//         discount:{
//             type: Number,
//           required: true,
//         },
//         shipping:{
//             type: Number,
//           required: true,
//         },
//         status: {
//           type: String,
//           enum: ["pending", "confirmed", "on-the-way", "cancelled"],
//           default: "pending",
//         },
//       },
//     ],
//     shippingAddress: {
//       fullName: { type: String, required: true },
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       pincode: { type: String, required: true },
//       phone: { type: String, required: true },
//     },
//     // optional: keep a general status for full order as well
//     orderStatus: {
//       type: String,
//       enum: ["pending", "confirmed", "shipped", "cancelled"],
//       default: "pending",
//     },

//      paymentInfo: {
//       method: {
//         type: String,
//         enum: ["Cash on Delivery", "Credit Card", "Debit Card", "UPI", "Net Banking"],
//         required: true,
//       },
//       status: {
//         type: String,
//         enum: ["pending", "paid", "failed", "refunded"],
//         default: "pending",
//       },
//       transactionId: { type: String },
//       paymentDate: { type: Date },
//         totalAmount: {
//       type: Number,
//       required: true,
//     },
//     },
//   },
//   { timestamps: true }
// );
// module.exports = mongoose.model("Order", orderSchema);








const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
 title: String,
  count: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "cancelled"],
    default: "pending",
  },
  totalAmount: { type: Number, required: true },
  paymentInfo: {
    paymentGroupId: String, // common ID for all orders in one payment
    method: {
      type: String,
      enum: ["Cash on Delivery", "Credit Card", "Debit Card", "UPI", "netbanking"],
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    transactionId: String,
    paymentDate: Date,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);



// Yes, Nikhil — ✅ this schema is absolutely correct for a real-world e-commerce application where:

// You want to store one order per product.

// All products in a single payment are linked by a paymentGroupId.

// You can track each item’s status individually.

// Both Admin and User Panels can show clean, item-wise order info.

// 🧠 Why Is This Better?
// Feature	Single Order (items array) ❌	Multiple Orders ✅
// Cancel/refund 1 item	Difficult	✅ Easy
// Track delivery/item	Hard	✅ Easy
// Show per-product status	Tricky	✅ Clean
// Realistic scale	Limited	✅ Works for 1 or 1000 items
// Razorpay Reconciliation	Harder	✅ Easier with group ID

// ✅ Real-World E-commerce Practice (Amazon, Flipkart, Meesho, etc.)
// Approach	Description	Common In	Pros	Cons
// 1. Single Order Document (with items array)	One order with all 10 products listed inside an items array	Used by small shops, startups, basic eCommerce	Simple to implement	Hard to manage per-item status, returns, refund, delivery
// 2. Multiple Orders with Same Payment Group ✅	Each product = 1 order, all share a paymentGroupId	Used by Amazon, Flipkart, Myntra, etc.	Flexible: per-item status, cancel, refund, tracking	Needs more backend code (but worth it)











// 🛒 Step 2: On Payment (from Cart)
// When a user checks out with multiple products:
// Create a unique paymentGroupId (e.g., using uuid).
// For each item in cart, create one order document:
// for (let item of cartItems) {
//   await Order.create({
//     userId: req.user._id,
//     productId: item._id,
//     name: item.name,
//     count: item.quantity,
//     price: item.price,
//     discount: item.discount,
//     shipping: item.shipping,
//     shippingAddress: userShippingAddress,
//     totalAmount: item.price * item.quantity + item.shipping,
//     paymentInfo: {
//       paymentGroupId: uniquePaymentGroupId,
//       method: "UPI",
//       status: "paid",
//       transactionId: razorpayPaymentId,
//       paymentDate: new Date(),
//     }
//   });
// }


// const paymentSchema = new mongoose.Schema({
//   userId: mongoose.Schema.Types.ObjectId,
//   paymentGroupId: String,
//   amount: Number,
//   transactionId: String,
//   paymentMethod: String,
//   status: String,
//   items: [productId],
// });
