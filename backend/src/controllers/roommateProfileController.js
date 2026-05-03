const RoommateProfile = require('../models/RoommateProfile');
const User = require('../models/User');
const RoommateGroup = require('../models/RoommateGroup');
const { scoreRoommateMatch } = require('../utils/matching');

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

exports.upsertProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const payload = {
      budgetMin: Number(req.body.budgetMin),
      budgetMax: Number(req.body.budgetMax),
      preferredLocation: req.body.preferredLocation,
      sleepHabit: req.body.sleepHabit,
      studyHabit: req.body.studyHabit,
      cleanliness: req.body.cleanliness,
      interests: Array.isArray(req.body.interests)
        ? req.body.interests
        : String(req.body.interests || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
      lookingForGroup: parseBoolean(req.body.lookingForGroup, true),
      userId
    };

    if (!payload.budgetMin || !payload.budgetMax || payload.budgetMin > payload.budgetMax) {
      return res.status(400).json({ error: 'Invalid budget range' });
    }

    const profile = await RoommateProfile.findOneAndUpdate({ userId }, payload, {
      upsert: true,
      new: true,
      runValidators: true
    });

    await User.findByIdAndUpdate(userId, { roommateProfileId: profile._id });

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await RoommateProfile.findOne({ userId: req.user.id }).populate('userId', 'name email profilePicture');
    if (!profile) {
      return res.status(404).json({ error: 'Roommate profile not found' });
    }

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.searchRoommates = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentProfile = await RoommateProfile.findOne({ userId: currentUserId });

    if (!currentProfile) {
      return res.status(404).json({ error: 'Please create your profile first' });
    }

    const minBudget = parseOptionalNumber(req.query.budgetMin);
    const maxBudget = parseOptionalNumber(req.query.budgetMax);
    const preferredLocation = req.query.preferredLocation;
    const sleepHabit = req.query.sleepHabit;
    const studyHabit = req.query.studyHabit;
    const cleanliness = req.query.cleanliness;
    const interest = req.query.interest;

    const query = {
      userId: { $ne: currentUserId },
      lookingForGroup: true,
      $or: [{ groupId: null }, { groupId: { $exists: false } }]
    };

    if (minBudget !== undefined) {
      query.budgetMax = { $gte: minBudget };
    }

    if (maxBudget !== undefined) {
      query.budgetMin = { ...(query.budgetMin || {}), $lte: maxBudget };
    }

    if (preferredLocation) {
      query.preferredLocation = new RegExp(preferredLocation, 'i');
    }

    if (sleepHabit) {
      query.sleepHabit = sleepHabit;
    }

    if (studyHabit) {
      query.studyHabit = studyHabit;
    }

    if (cleanliness) {
      query.cleanliness = cleanliness;
    }

    if (interest) {
      query.interests = interest;
    }

    const candidates = await RoommateProfile.find(query).populate('userId', 'name email profilePicture');
    const enriched = candidates
      .map((candidate) => {
        const compatibilityScore = scoreRoommateMatch(currentProfile, candidate);
        return {
          ...candidate.toObject(),
          compatibilityScore
        };
      })
      .sort((left, right) => right.compatibilityScore - left.compatibilityScore);

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getProfileByUserId = async (userId) => RoommateProfile.findOne({ userId }).populate('userId', 'name email profilePicture');

exports.getMembersInGroup = async (groupId) => {
  const group = await RoommateGroup.findById(groupId).populate('members', 'name email profilePicture');
  return group;
};
