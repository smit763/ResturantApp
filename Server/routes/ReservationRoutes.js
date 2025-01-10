const express = require("express");
const { reserveTable, getTableAllReservation } = require("../controllers/ReservationController");
const router = express.Router();

router.post("/reserve/table/:id", reserveTable);
router.get("/table/reservation/:id", getTableAllReservation);

module.exports = router;
