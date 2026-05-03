const mongoose = require('mongoose');

const roommateGroupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true, trim: true },
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } }
);

roommateGroupSchema.index({ leaderId: 1 });

module.exports = mongoose.model('RoommateGroup', roommateGroupSchema);
