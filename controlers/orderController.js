const Order = require("../models/Order");

// POST /api/orders - Create order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

// imp imp imp 
    // console.log("The user id in the order", req.user.id);//when we use the mongoos then the _id will be converted to the id whcih is string type so use it ok
    // console.log(req.user);
    const newOrder = new Order({
      userId: req.user.id, // From auth middleware
      items,
      shippingAddress,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// GET /api/orders/my - Get logged-in user's order history
const getUserOrders = async (req, res) => {
  try {
    //  console.log("The user id in the order", req.user.id);
    // ❌ dont use the  req.user._id it will notmgive error but not match with any id dat is not come  
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to get orders", error: err.message });
  }
};

// GET /api/orders - Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Admin fetch failed", error: err.message });
  }
};

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

const updateOrderStatus = async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.id(itemId); // Or use String(itemId) for safety

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = status;
    await order.save();

    res.json({ message: "Item status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};




// Export all controller functions
module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
