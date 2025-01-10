const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Menu", MenuSchema);