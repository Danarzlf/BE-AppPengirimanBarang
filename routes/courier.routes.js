const express = require("express");
const {
    createCourier,
    updateCourier

} = require("../controllers/courier.controller");

const router = express.Router();

router.post("/create-courier", createCourier);
router.put('/:courierId', updateCourier);

module.exports = router;
