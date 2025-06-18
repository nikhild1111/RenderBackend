const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "confirmed", "shipped", "cancelled"],
          default: "pending",
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    // optional: keep a general status for full order as well
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Order", orderSchema);

// we can use this also

// {
//   userId: ObjectId (ref: "User"),
//   items: [ // array of products
//     {
//       productId: ObjectId (ref: "Product"),
//       name: String, // optional for UI speed
//       quantity: Number,
//       price: Number
//     }
//   ],
//   shippingAddress: {
//     fullName, address, city, pincode, phone
//   },
//   totalAmount: Number,
//   status: "pending" | "confirmed" | "shipped" | "cancelled",
//   timestamps: true
// }
