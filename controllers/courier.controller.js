const Courier = require('../models/Courier');
const Shipment = require('../models/Shipment');


const createCourier = async (req, res, next) => {
    try {
        const { name, phoneNumber, vehicleType, licensePlate, shipmentId, dropOffId } = req.body;

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

        // // Check if dropoff exists
        // if (dropOffId) {
        //     const existingDropoff = await Dropoff.findById(dropOffId);
        //     if (!existingDropoff) {
        //         return res.status(404).json({
        //             status: false,
        //             message: "Dropoff location not found.",
        //             data: null,
        //         });
        //     }
        // }

        // Create new courier record
        const newCourier = await Courier.create({
            name,
            phoneNumber,
            vehicleType,
            licensePlate,
            shipmentId,
            dropOffId,
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

        // Periksa apakah ada perubahan yang diminta pada lokasi dropoff terkait
        if (updateData.dropOffId) {
            // Periksa apakah lokasi dropoff yang diminta ada
            const existingDropoff = await Dropoff.findById(updateData.dropOffId);
            if (!existingDropoff) {
                return res.status(404).json({
                    status: false,
                    message: "Dropoff location not found.",
                    data: null,
                });
            }
        }

        // Lakukan pembaruan pada kurir
        const updatedCourier = await Courier.findByIdAndUpdate(courierId, updateData, { new: true });

        res.status(200).json({
            status: true,
            message: "Courier updated successfully",
            data: updatedCourier,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createCourier,
    updateCourier,
};
