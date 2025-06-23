

const Order = require('../models/Order');
const User=require("../models/UserData");
const mongoose = require("mongoose");
const Product = require('../models/Product');
const mailSender = require("../utils/mailSender");
const shippedTemplate = require('../utils/emailTemplates/Ordershipped');
const cancelledTemplate = require('../utils/emailTemplates/Ordercancelled');
const pendingTemplate = require('../utils/emailTemplates/Orderpending');
const insufficientStockTemplate = require('../utils/emailTemplates/insufficientStock');
const confirmedTemplate = require('../utils/emailTemplates/Adminconfirmed');

// Get User Orders
// const getUserOrders = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const orders = await Order.find({ userId })
//       .populate('productId', 'name images category')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const totalOrders = await Order.countDocuments({ userId });

//     res.status(200).json({
//       success: true,
//       orders,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalOrders / limit),
//         totalOrders,
//         hasNext: page < Math.ceil(totalOrders / limit),
//         hasPrev: page > 1
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching user orders:', error);
//     res.status(500).json({ message: 'Error fetching orders', error: error.message });
//   }
// };

// controllers/orderController.js



//  do both work filter and normal
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      keyword = "",
      status = "",
      date = "",
      sort = "recent",
      page = 1,
      limit = 10,
    } = req.body;

    const query = { userId };

    // 🔍 Keyword search on title
    if (keyword && keyword.trim()) {
      const regEx = new RegExp(keyword.trim(), 'i');
      query.title = regEx;
    }

    // 📅 Filter by exact date
    if (date && date.trim()) {
      const targetDate = new Date(date);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);

      query.createdAt = {
        $gte: targetDate,
        $lt: nextDate,
      };
    }

    // 🛒 Order status filter
    if (status && status.trim()) {
      query.orderStatus = status.trim();
    }

    // ⏳ Sorting logic
    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const skip = (page - 1) * limit;
    const parsedLimit = parseInt(limit);

    // 📦 Fetch orders with population
    const orders = await Order.find(query)
      .populate({
        path: 'productId',
        select: 'title brand image price discount type'
      })
      .populate({
        path: 'userId',
        select: 'name email phone role totalSpends totalOrders' // optional: depends if you want to show user info
      })
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit);

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / parsedLimit);

  const pendingCount = await Order.countDocuments({
      userId,
      orderStatus: 'pending',
    });

    

    res.status(200).json({
      success: true,
      orders,
      currentPage: parseInt(page),
      totalPages,
      totalOrders,
      pendingCount,
      appliedFilters: { keyword, status, date, sort }
    });

  } catch (err) {
    console.error("Error fetching filtered orders:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};








// Get Single Order
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId })
      .populate('productId', 'name images category description')
      .populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Cancel Order (User)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'shipped' || order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};

// ===========================
// ADMIN FUNCTIONS
// ===========================

// Get All Orders (Admin) do both work filter and normal
// const getAllOrders = async (req, res) => {
//   try {
//     // Destructure from req.body with defaults
//     const {
//       keyword = "",
//       status = "",
//       date = "",
//       sort = "recent",
//       page = 1,
//       limit = 10,
//     } = req.body;

//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     let query = {};

//     // Filter by order status
//     if (status.trim()) {
//       query.orderStatus = status.trim();
//     }

//     // Filter by keyword (in product title)
//     if (keyword.trim()) {
//       query.title = { $regex: keyword.trim(), $options: "i" };
//     }

//     // Filter by created date (exact date)
//     if (date.trim()) {
//       const start = new Date(date);
//       const end = new Date(date);
//       end.setHours(23, 59, 59, 999);
//       query.createdAt = { $gte: start, $lte: end };
//     }

//     // Sorting
//     const sortBy = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

//     // Fetch paginated orders
//     const orders = await Order.find(query)
//        .populate({
//         path: 'productId',
//         select: 'title brand image price discount type'
//       })
//       .populate({
//         path: 'userId',
//         select: 'name email phone role totalSpends totalOrders' // optional: depends if you want to show user info
//       })
//       .sort(sortBy)
//       .skip(skip)
//       .limit(parseInt(limit));

//     // Total matching orders (for pagination)
//     const totalOrders = await Order.countDocuments(query);

//     // Stats for dashboard
//     const userCount = await User.countDocuments();
//     const orderCount = await Order.countDocuments(); // total without filters

//     // Total revenue based on full matching set (not paginated)
//     const revenueAgg = await Order.aggregate([
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } }
//     ]);
//     const totalRevenue = revenueAgg[0]?.total || 0;

//     const pendingCount = await Order.countDocuments({ orderStatus: 'pending' });

//     res.status(200).json({
//       success: true,
//       orders,
//       userCount,
//       orderCount,
//       totalRevenue,
//       pendingCount,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(totalOrders / parseInt(limit)),
//         totalOrders,
//         hasNext: parseInt(page) < Math.ceil(totalOrders / parseInt(limit)),
//         hasPrev: parseInt(page) > 1
//       }
//     });

//   } catch (error) {
//     console.error("Error in getAllOrders:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch orders",
//       error: error.message
//     });
//   }
// };



// here we not take the order for whcoh the user id and the product id is not eexist as the error will come 
const getAllOrders = async (req, res) => {
  try {
    const {
      keyword = "",
      status = "",
      date = "",
      sort = "recent",
      page = 1,
      limit = 10,
    } = req.body;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let query = {};

    // Filters
    if (status.trim()) {
      query.orderStatus = status.trim();
    }

    if (keyword.trim()) {
      query.title = { $regex: keyword.trim(), $options: "i" };
    }

    if (date.trim()) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const sortBy = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    // Fetch all matching orders first
    const allOrders = await Order.find(query)
      .populate("productId")
      .populate("userId")
      .sort(sortBy);

// 2. ✅ Filter only valid orders where both product and user exist
const validOrders = allOrders.filter(
  (order) => order.productId !== null && order.userId !== null
);


    // Pagination on filtered orders
    const paginatedOrders = validOrders.slice(skip, skip + parseInt(limit));

    // Stats
    const totalOrders = validOrders.length;
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    const pendingCount = await Order.countDocuments({ orderStatus: "pending" });

    res.status(200).json({
      success: true,
      orders: paginatedOrders,
      userCount,
      orderCount,
      totalRevenue,
      pendingCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / parseInt(limit)),
        totalOrders,
        hasNext: parseInt(page) < Math.ceil(totalOrders / parseInt(limit)),
        hasPrev: parseInt(page) > 1,
      },
    });

  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};



// Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(orderId).populate("userId").populate("productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const user = order.userId;
    const product = order.productId;

    if (!user) {
      return res.status(404).json({ message: `User not found for ID: ${order.userId}` });
    }

    if (!product) {
      return res.status(404).json({ message: `Product not found for ID: ${order.productId}` });
    }

    if (order.orderStatus === orderStatus) {
      return res.status(200).json({ message: "Order status is already up to date" });
    }

    // ✅ Handle "confirmed" status
    if (orderStatus === "confirmed") {
      if (product.quantity < order.count) {
        // Notify admin about insufficient stock
        await mailSender(
          req.user.email || process.env.ADMIN_EMAIL,
          "⚠️ Action Needed: Insufficient Stock for Order",
          "Order cannot be confirmed due to low stock.",
          insufficientStockTemplate({ user, product, order })
        );

        return res.status(400).json({
          message: "Insufficient stock to confirm this order. Admin notified.",
        });
      }

      // Reduce stock
      product.quantity -= order.count;
      await product.save();

      // Update order status
      order.orderStatus = "confirmed";
      await order.save();

      // Send confirmation mail to user
      await mailSender(
        user.email,
        "✅ Order Confirmed - ECOMZY",
        "Your order has been confirmed.",
        confirmedTemplate({ user, product, order })
      );
    }

    // ✅ Handle "shipped"
    else if (orderStatus === "shipped") {
      order.orderStatus = "shipped";
      await order.save();

      await mailSender(
        user.email,
        "📦 Order Shipped - ECOMZY",
        "Your order has been shipped.",
        shippedTemplate({ user, product, order })
      );
    }

    // ✅ Handle "cancelled"
    else if (orderStatus === "cancelled") {
      order.orderStatus = "cancelled";
      await order.save();

      await mailSender(
        user.email,
        "❌ Order Cancelled - ECOMZY",
        "Your order has been cancelled.",
        cancelledTemplate({ user, product, order })
      );
    }

    // ✅ Handle "pending"
    else if (orderStatus === "pending") {
      order.orderStatus = "pending";
      await order.save();

      await mailSender(
        user.email,
        "⏳ Order Pending - ECOMZY",
        "Your order is pending.",
        pendingTemplate({ user, product, order })
      );
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to '${orderStatus}'`,
      order,
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};






const searchUsers = async (req, res) => {
  try {
    const { search = '', page = 1 } = req.body;
    const limit = 15;

    const isObjectId = mongoose.Types.ObjectId.isValid(search);
    const isNumeric = /^\d+$/.test(search.trim()); // Check if search is a number

    // Dynamically build query
    const orConditions = [];

    if (isObjectId) {
      orConditions.push({ _id: new mongoose.Types.ObjectId(search) });
    }

    if (search) {
      orConditions.push(
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      );

      if (isNumeric) {
        orConditions.push({ phone: Number(search) });
      }

      // Optional: If address is part of the schema and is a string
      orConditions.push({ address: new RegExp(search, 'i') });
    }

    const query = search ? { $or: orConditions } : {}; // If search is empty, fetch all

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (err) {
    console.error("User search failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  searchUsers
};