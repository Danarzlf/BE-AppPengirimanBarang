const express = require("express");
const {
    createSender,
    updateSender

} = require("../controllers/sender.controller");

const router = express.Router();

router.post("/create-senders", createSender);
router.put('/:senderId', updateSender);

module.exports = router;
