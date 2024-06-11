const express = require("express");
const {
    createShipment,
    getShipmentById

} = require("../controllers/shipment.controller");

const router = express.Router();

router.post("/create-shipments", createShipment);
router.get("/:id", getShipmentById);


module.exports = router;
