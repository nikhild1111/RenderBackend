const express = require("express");
const { getProducts } = require("../controlers/ProductController");
const router = express.Router();
// to get he value bec=ased on the search
router.post("/search", getProducts);

module.exports = router;