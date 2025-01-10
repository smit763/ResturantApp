const express = require("express");
const router = express.Router();
const Menu = require("../models/MenuModel");

exports.addMenu = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const newMenu = new Menu({
      name,
      description,
      price,
    });

    const savedMenu = await newMenu.save();

    res.status(200).json({
      message: "Menu Added Successfully!",
      success: true,
      data: savedMenu,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error: error });
  }
};

exports.getAllMenu = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const totalMenus = await Menu.countDocuments();
    const totalPages = Math.ceil(totalMenus / limitNumber);

    const menus = await Menu.find().skip(skip).limit(limitNumber);

    if (menus.length === 0) {
      return res.status(201).json({
        message: "There is no Menu.",
        success: false,
      });
    }
    res.status(200).json({
      message: "Menu Fetched Successfully!",
      success: true,
      data: menus,
      pagination: {
        total: totalMenus,
        page: pageNumber,
        limit: limitNumber,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", success: false, error: error });
  }
};

