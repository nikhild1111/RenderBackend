// // routes/paymentRoutes.js

const express = require("express");
const {auth ,isAdmin} = require("../middlewares/auth");
const router = express.Router();
const {
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  searchUsers
} = require('../controllers/dashboardcontollers');


router.post('/my-orders', auth, getUserOrders);
router.get('/order/:orderId', auth, getOrderById);
router.put('/cancel/:orderId', auth, cancelOrder);

// Admin Routes
router.post('/admin/all-orders', auth, isAdmin, getAllOrders);
router.put('/admin/update-status/:orderId', auth, isAdmin, updateOrderStatus);
router.post("/users", auth, isAdmin, searchUsers);
module.exports = router;


