// models/service.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    shipmentId: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
    },
    nameServices: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: { createdAt: "created_At", updatedAt: "updated_At" } }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
