const mongoose = require('mongoose');

const roommateProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    budgetMin: { type: Number, required: true },
    budgetMax: { type: Number, required: true },
    preferredLocation: { type: String, required: true, trim: true },
    sleepHabit: { type: String, enum: ['early bird', 'night owl', 'flexible'], required: true },
    studyHabit: { type: String, enum: ['quiet', 'group study', 'flexible'], required: true },
    cleanliness: { type: String, enum: ['very tidy', 'moderate', 'casual'], required: true },
    interests: [{ type: String, trim: true }],
    lookingForGroup: { type: Boolean, default: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoommateGroup' }
  },
  { timestamps: true }
);

roommateProfileSchema.index({ lookingForGroup: 1, preferredLocation: 1 });

module.exports = mongoose.model('RoommateProfile', roommateProfileSchema);
