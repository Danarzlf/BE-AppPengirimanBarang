const express = require("express");
const {
  createShipment,
  getShipmentById,
  deleteShipment,
} = require("../controllers/shipment.controller");

const router = express.Router();

router.post("/create-shipments", createShipment);
router.get("/:id", getShipmentById);
router.delete("/:id", deleteShipment);

module.exports = router;
