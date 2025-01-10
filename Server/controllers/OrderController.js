const Order = require("../models/OrderModel");
const Table = require("../models/TableModel");
const Reservation = require("../models/ResevationModel");

exports.createOrder = async (req, res) => {
  try {
    const { tableId, reservationId, menuItems } = req.body;

    const table = await Table.findOne({ _id: tableId });
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    const reservation = await Reservation.findOne({ _id: reservationId });
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.tableId.toString() !== tableId) {
      return res.status(400).json({
        success: false,
        message: "This reservation does not belong to the selected table.",
      });
    }

    const activeOrder = await Order.findOne({
      tableId,
      completedAt: null,
    });

    if (activeOrder) {
      return res.status(400).json({
        success: false,
        message: "Complete the current order before creating a new one.",
      });
    }

    const newOrder = new Order({
      tableId,
      reservationId,
      menuItems,
      createdAt: new Date(),
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Order created successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { tableId, reservationId, menuItems } = req.body;

    const table = await Table.findOne({ _id: tableId });
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    const reservation = await Reservation.findOne({ _id: reservationId });
    if (!reservation) {
      return res.status(201).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.tableId.toString() !== tableId) {
      return res.status(201).json({
        success: false,
        message: "This reservation does not belong to the selected table.",
      });
    }

    const activeOrder = await Order.findOne({
      tableId,
      reservationId,
      completedAt: null,
    });

    if (!activeOrder) {
      return res.status(201).json({
        success: false,
        message: "No active order found for the given reservation and table.",
      });
    }

    activeOrder.menuItems = [...activeOrder.menuItems, ...menuItems];

    await activeOrder.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order: activeOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    const table = await Table.findById(id);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    const activeOrder = await Order.findOne({
      tableId: id,
      completedAt: null,
    });

    if (!activeOrder) {
      return res
        .status(201)
        .json({ success: false, message: "No active order to complete." });
    }

    activeOrder.paymentMethod = paymentMethod;
    activeOrder.completedAt = new Date();
    await activeOrder.save();

    res.status(200).json({
      success: true,
      message: "Order completed successfully.",
      data: activeOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error,
    });
  }
};

exports.getSingleOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.find({ reservationId: id })
      .populate("menuItems.menuItemId")
      .exec();

    if (order.length === 0) {
      return res.status(201).json({ error: "No order for this table" });
    }
    res.json({
      message: "order fetched successfully!",
      success: true,
      data: order,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Server error" });
  }
};
