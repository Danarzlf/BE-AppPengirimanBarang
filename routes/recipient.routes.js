const express = require("express");
const {
    createRecipient,
    updateRecipient

} = require("../controllers/recipient.controller");

const router = express.Router();

router.post("/create-recipients", createRecipient);
router.put('/:recipientId', updateRecipient);

module.exports = router;
