const express = require("express");
const {
  createShipment,
  getShipmentById,
  deleteShipment,
  getAllShipments,
  updateShipmentById
} = require("../controllers/shipment.controller");

const router = express.Router();

router.post("/create-shipments", createShipment);
router.get("/:id", getShipmentById);
router.delete("/:id", deleteShipment);
router.get("/", getAllShipments);
router.put("/:id", updateShipmentById);

module.exports = router;
