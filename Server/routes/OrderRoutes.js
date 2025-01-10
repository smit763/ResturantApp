const express = require("express");
const { createOrder, completeOrder, updateOrder, getSingleOrder } = require("../controllers/OrderController");
const router = express.Router();

router.post("/add/order", createOrder);
router.post("/complete/order/:id", completeOrder);
router.put("/update/order", updateOrder);
router.get("/get/single/order/:id", getSingleOrder);


module.exports = router;
