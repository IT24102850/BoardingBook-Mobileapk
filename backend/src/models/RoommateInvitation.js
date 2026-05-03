const mongoose = require('mongoose');

const roommateInvitationSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    respondedAt: { type: Date }
  },
  { timestamps: true }
);

roommateInvitationSchema.index({ fromUser: 1, toUser: 1, status: 1 });

module.exports = mongoose.model('RoommateInvitation', roommateInvitationSchema);
