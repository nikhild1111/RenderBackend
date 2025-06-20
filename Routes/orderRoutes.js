const express = require("express");
const { createRazorpayOrder, verifyPayment, confirmOrder, paymentFailure } = require("../controllers/orderController"); // ✅ fix spelling

const { auth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/create-razorpay-order", auth, createRazorpayOrder);
router.post("/verify-payment", auth, verifyPayment);
router.post("/confirm-order", auth, confirmOrder);
router.post("/payment-failure", auth, paymentFailure);


module.exports = router;
