const Courier = require("../models/courier");
const Shipment = require("../models/shipment");

const createCourier = async (req, res, next) => {
  try {
    const { name, phoneNumber, vehicleType, licensePlate, shipmentId } =
      req.body;

    // Validate required fields
    if (!shipmentId || !name || !phoneNumber) {
      return res.status(400).json({
        status: false,
        message: "Shipment ID, name, and phone number are required.",
        data: null,
      });
    }

    // Check if shipment exists
    const existingShipment = await Shipment.findById(shipmentId);
    if (!existingShipment) {
      return res.status(404).json({
        status: false,
        message: "Shipment not found.",
        data: null,
      });
    }

    // Create new courier record
    const newCourier = await Courier.create({
      name,
      phoneNumber,
      vehicleType,
      licensePlate,
      shipmentId,
    });

    res.status(201).json({
      status: true,
      message: "Courier created successfully",
      data: newCourier,
    });
  } catch (err) {
    next(err);
  }
};

const updateCourier = async (req, res, next) => {
  try {
    const courierId = req.params.courierId; // Mengambil ID kurir dari parameter rute
    const updateData = req.body; // Data baru untuk diperbarui

    // Periksa apakah kurir ada
    const existingCourier = await Courier.findById(courierId);
    if (!existingCourier) {
      return res.status(404).json({
        status: false,
        message: "Courier not found.",
        data: null,
      });
    }

    // Periksa apakah ada perubahan yang diminta pada pengiriman terkait
    if (updateData.shipmentId) {
      // Periksa apakah pengiriman yang diminta ada
      const existingShipment = await Shipment.findById(updateData.shipmentId);
      if (!existingShipment) {
        return res.status(404).json({
          status: false,
          message: "Shipment not found.",
          data: null,
        });
      }
    }

    // Lakukan pembaruan pada kurir
    const updatedCourier = await Courier.findByIdAndUpdate(
      courierId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Courier updated successfully",
      data: updatedCourier,
    });
  } catch (err) {
    next(err);
  }
};

const getCourierById = async (req, res, next) => {
  try {
    const courierId = req.params.courierId; // Retrieve the courier ID from the route parameters

    // Check if the courier exists
    const existingCourier = await Courier.findById(courierId);
    if (!existingCourier) {
      return res.status(404).json({
        status: false,
        message: "Courier not found.",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Courier retrieved successfully",
      data: existingCourier,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  createCourier,
  updateCourier,
  getCourierById,
};
