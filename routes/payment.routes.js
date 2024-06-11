const express = require("express");
const {
    createPayment,
    updatePayment,

} = require("../controllers/payment.controller");

const router = express.Router();

router.post("/create-payment", createPayment);
router.put('/:paymentId', updatePayment);

module.exports = router;
