const express = require("express");
const { getAllTables, addTable } = require("../controllers/tableController");
const router = express.Router();

router.get("/all/tables", getAllTables);

router.post("/add/table", addTable);

module.exports = router;
