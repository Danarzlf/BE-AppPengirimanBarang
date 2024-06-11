const express = require("express");
const {
  createService,
  updateService,
  getServiceById,
} = require("../controllers/service.controller");

const router = express.Router();

router.post("/create-service", createService);
router.put("/:serviceId", updateService);
router.get("/:serviceId", getServiceById);

module.exports = router;
