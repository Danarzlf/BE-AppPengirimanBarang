const express = require("express");
const {
  createShipment,
  getShipmentById,
  deleteShipment,
} = require("../controllers/Shipment.controller");

const router = express.Router();

router.post("/create-shipments", createShipment);
router.get("/:id", getShipmentById);
router.delete("/:id", deleteShipment);

module.exports = router;
