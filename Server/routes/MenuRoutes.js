const express = require("express");
const { getAllMenu, addMenu } = require("../controllers/MenuController");
const router = express.Router();

router.get("/all/menus", getAllMenu);
router.post("/add/menu", addMenu);

module.exports = router;
