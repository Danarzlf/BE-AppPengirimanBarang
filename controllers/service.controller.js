// Mengganti impor model Sender dengan model Service
const Service = require("../models/service");
const Shipment = require("../models/shipment");

const createService = async (req, res, next) => {
  try {
    const { nameServices, price, description, shipmentId } = req.body;

    // Validasi field yang diperlukan
    if (!shipmentId || !nameServices || !price) {
      return res.status(400).json({
        status: false,
        message: "Shipment ID, service name, and price are required.",
        data: null,
      });
    }

    // Periksa apakah pengiriman yang diminta ada
    const existingShipment = await Shipment.findById(shipmentId);
    if (!existingShipment) {
      return res.status(404).json({
        status: false,
        message: "Shipment not found.",
        data: null,
      });
    }

    // Buat catatan layanan baru
    const newService = await Service.create({
      nameServices,
      price,
      description,
      shipmentId,
    });

    res.status(201).json({
      status: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (err) {
    next(err);
  }
};

const updateService = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId; // Mengambil ID layanan dari parameter rute
    const updateData = req.body; // Data baru untuk diperbarui

    // Periksa apakah layanan ada
    const existingService = await Service.findById(serviceId);
    if (!existingService) {
      return res.status(404).json({
        status: false,
        message: "Service not found.",
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

    // Lakukan pembaruan pada layanan
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (err) {
    next(err);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId; // Retrieve the service ID from the route parameters

    // Check if the service exists
    const existingService = await Service.findById(serviceId);
    if (!existingService) {
      return res.status(404).json({
        status: false,
        message: "Service not found.",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Service retrieved successfully",
      data: existingService,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createService,
  updateService,
  getServiceById,
};
