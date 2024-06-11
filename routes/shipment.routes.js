const express = require("express");
const {
    createShipment,
    getShipmentById

} = require("../controllers/Shipment.controller");

const router = express.Router();

router.post("/create-shipments", createShipment);
router.get("/:id", getShipmentById);


module.exports = router;
