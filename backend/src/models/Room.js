const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    boardingName: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    monthlyRent: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
