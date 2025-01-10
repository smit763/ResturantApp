const Reservation = require("../models/ResevationModel");
const Table = require("../models/TableModel");

exports.getAllTables = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const totalTables = await Table.countDocuments();
    const totalPages = Math.ceil(totalTables / limitNumber);

    const tables = await Table.find().skip(skip).limit(limitNumber);

    if (tables.length === 0) {
      return res.status(201).json({
        message: "There are no tables available.",
        success: false,
      });
    }

    const tablesWithReservationCount = await Promise.all(
      tables.map(async (table) => {
        const reservationCount = await Reservation.countDocuments({
          tableId: table._id,
        });

        return {
          ...table.toObject(),
          reservationCount,
        };
      })
    );

    return res.status(200).json({
      message: "Tables fetched successfully!",
      success: true,
      data: tablesWithReservationCount,
      pagination: {
        total: totalTables,
        page: pageNumber,
        limit: limitNumber,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error: error });
  }
};

exports.addTable = async (req, res) => {
  try {
    const { tableNumber, seats } = req.body;
    const newTable = new Table({
      tableNumber,
      seats,
      reservations: [],
      orderHistory: [],
    });

    const savedTable = await newTable.save();
    res.status(200).json({
      message: "Tables Added Successfully!",
      success: true,
      data: savedTable,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error: error });
  }
};
