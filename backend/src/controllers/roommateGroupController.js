const RoommateGroup = require('../models/RoommateGroup');
const RoommateProfile = require('../models/RoommateProfile');

exports.getMyGroup = async (req, res) => {
  try {
    const group = await RoommateGroup.findOne({ members: req.user.id })
      .populate('leaderId', 'name email profilePicture')
      .populate('members', 'name email profilePicture');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    return res.json(group);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const group = await RoommateGroup.findOne({ members: userId });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    group.members = group.members.filter((memberId) => memberId.toString() !== userId);

    if (group.members.length === 0) {
      await RoommateProfile.findOneAndUpdate({ userId }, { groupId: null, lookingForGroup: true });
      await group.deleteOne();
      return res.json({ message: 'You left and the group was deleted because it became empty' });
    }

    if (group.leaderId.toString() === userId) {
      group.leaderId = group.members[0];
    }

    await group.save();
    await RoommateProfile.findOneAndUpdate({ userId }, { groupId: null, lookingForGroup: true });

    return res.json({ message: 'Left group successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
