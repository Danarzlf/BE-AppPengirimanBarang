const express = require("express");
const {
  createShipment,
  getShipmentById,
  deleteShipment,
  getAllShipments,
} = require("../controllers/shipment.controller");

const router = express.Router();

router.post("/create-shipments", createShipment);
router.get("/:id", getShipmentById);
router.delete("/:id", deleteShipment);
router.get("/", getAllShipments);

module.exports = router;
