// // routes/paymentRoutes.js

const express = require("express");
const {auth ,isAdmin} = require("../middlewares/auth");
const router = express.Router();
const {
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/dashboardcontollers');


router.get('/my-orders', auth, getUserOrders);
router.get('/order/:orderId', auth, getOrderById);
router.put('/cancel/:orderId', auth, cancelOrder);

// Admin Routes
router.get('/admin/all-orders', auth, isAdmin, getAllOrders);
router.put('/admin/update-status/:orderId', auth, isAdmin, updateOrderStatus);

module.exports = router;


