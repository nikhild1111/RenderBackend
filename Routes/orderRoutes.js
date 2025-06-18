const express = require("express");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controlers/orderController"); // ✅ fix spelling

const { auth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// User
router.post("/", auth, createOrder);
router.get("/my", auth, getUserOrders);

// Admin
router.get("/", auth, isAdmin, getAllOrders);
console.log("PATCH route hit");
router.patch("/:orderId/item/:itemId/status", auth, isAdmin, updateOrderStatus);

module.exports = router;
