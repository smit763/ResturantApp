const Table = require("../models/TableModel");
const Reservation = require("../models/ResevationModel");

exports.reserveTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, customerName } = req.body;

    const table = await Table.findById(id);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    const isOverlap = await Reservation.findOne({
      tableId: id,
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) },
    });

    if (isOverlap) {
      return res.status(400).json({
        success: false,
        message: "Table is already reserved for this time.",
      });
    }

    const newReservation = new Reservation({
      tableId: table._id,
      startTime,
      endTime,
      customerName,
    });

    await newReservation.save();

    res.status(200).json({
      success: true,
      message: "Table reserved successfully.",
      data: newReservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getTableAllReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.find({ tableId: id });
    console.log(reservation);

    if (reservation.length === 0) {
      return res.status(201).json({ error: "No reservation for this table" });
    }
    res.json({
      message: "reservation fetched successfully!",
      success: true,
      data: reservation,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
