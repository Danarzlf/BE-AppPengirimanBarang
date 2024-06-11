const express = require("express");
const {
    createCourier,
    updateCourier,
    getCourierById

} = require("../controllers/courier.controller");

const router = express.Router();

router.post("/create-courier", createCourier);
router.put('/:courierId', updateCourier);
router.get('/:courierId', getCourierById);


module.exports = router;
