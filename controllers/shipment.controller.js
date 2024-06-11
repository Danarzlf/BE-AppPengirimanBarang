const mongoose = require("mongoose");
const Shipment = require("../models/shipment");
const User = require("../models/user");
const Sender = require("../models/sender");

const createShipment = async (req, res, next) => {
    try {
        const { userId, noTrack, type, status, courierId} = req.body;

        // Validate required fields
        if (!userId || !type || !status) {
            return res.status(400).json({
                status: false,
                message: "All fields are required.",
                data: null,
            });
        }

        // Check if user exists
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: "User not found.",
                data: null,
            });
        }

        // Create new shipment record
        const newShipment = await Shipment.create({
            userId,
            noTrack,
            type,
            status,
            courierId,
        });

        res.status(201).json({
            status: true,
            message: "Shipment created successfully",
            data: newShipment,
        });

    } catch (err) {
        next(err);
    }
};

const getShipmentById = async (req, res, next) => {
    try {
        const shipmentId = req.params.id;

        // Find the Shipment by its ID
        const shipment = await Shipment.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(shipmentId) }
            },
            {
                $lookup: {
                    from: "senders",
                    localField: "_id",
                    foreignField: "shipmentId",
                    as: "sender"
                }
            },
            {
                $unwind: { path: "$sender", preserveNullAndEmptyArrays: true }
            }
        ]);

        if (shipment.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Shipment not found.",
                data: null,
            });
        }

        res.status(200).json({
            status: true,
            message: "Shipment found successfully.",
            data: {
                shipment: shipment[0],
            },
        });
        
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createShipment,
    getShipmentById,
};
