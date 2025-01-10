const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    customerName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
