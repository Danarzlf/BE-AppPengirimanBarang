const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipmentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  noTrack: { type: String},
  type: {
    type: String,
    enum: ['PickUp', 'DropOff'],
    default: 'PickUp',
    required: true
  },
  status: { 
    type: String, 
    required: true, 
    default: 'In Progress' 
  },
  courierId: { type: Schema.Types.ObjectId, ref: 'Courier'},
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service'},
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;
