const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courierSchema = new Schema({
  id: {
    type: Number,
    primaryKey: true, // This isn't standard Mongoose. ObjectId is generally used as primary key.
  },
  dropOffId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Dropoff' 
  },
  shipmentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Shipment' 
  },
  name: { 
    type: String, 
    required: true 
  },
  phoneNumber: { 
    type: String, 
    required: true 
  },
  vehicleType: { 
    type: String, 
    required: true 
  },
  licensePlate: { 
    type: String, 
    required: true 
  },
}, { timestamps: true });

const Courier = mongoose.model('Courier', courierSchema);

module.exports = Courier;
