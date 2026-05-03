const RoommateInvitation = require('../models/RoommateInvitation');
const RoommateProfile = require('../models/RoommateProfile');
const RoommateGroup = require('../models/RoommateGroup');
const User = require('../models/User');

const getGroupForUser = async (userId) => RoommateGroup.findOne({ members: userId }).populate('members', 'name email profilePicture');

const syncProfileGroup = async (userId, groupId, lookingForGroup = false) => {
  await RoommateProfile.findOneAndUpdate(
    { userId },
    {
      groupId,
      lookingForGroup
    }
  );
};

exports.sendInvitation = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user.id;

    if (!toUserId || toUserId === fromUserId) {
      return res.status(400).json({ error: 'Invalid invitation target' });
    }

    const duplicate = await RoommateInvitation.findOne({
      $or: [
        { fromUser: fromUserId, toUser: toUserId, status: 'pending' },
        { fromUser: toUserId, toUser: fromUserId, status: 'pending' }
      ]
    });

    if (duplicate) {
      return res.status(400).json({ error: 'Invitation already pending' });
    }

    const invitation = await RoommateInvitation.create({ fromUser: fromUserId, toUser: toUserId });
    return res.status(201).json(invitation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getMyInvitations = async (req, res) => {
  try {
    const userId = req.user.id;
    const invitations = await RoommateInvitation.find({
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
      .populate('fromUser', 'name email profilePicture')
      .populate('toUser', 'name email profilePicture')
      .sort({ createdAt: -1 });

    return res.json(invitations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const invitation = await RoommateInvitation.findById(id);

    if (!invitation || invitation.status !== 'pending' || invitation.toUser.toString() !== userId) {
      return res.status(400).json({ error: 'Invalid invitation' });
    }

    const [fromProfile, toProfile] = await Promise.all([
      RoommateProfile.findOne({ userId: invitation.fromUser }),
      RoommateProfile.findOne({ userId: invitation.toUser })
    ]);

    if (!fromProfile || !toProfile) {
      return res.status(404).json({ error: 'Roommate profiles are required before accepting' });
    }

    const fromGroup = await getGroupForUser(invitation.fromUser);
    const toGroup = await getGroupForUser(invitation.toUser);

    if (fromGroup && toGroup && fromGroup._id.toString() !== toGroup._id.toString()) {
      return res.status(400).json({ error: 'Both users already belong to different groups' });
    }

    let targetGroup = fromGroup || toGroup;

    if (!targetGroup) {
      const leader = await User.findById(invitation.fromUser);
      const groupName = `${leader ? leader.name : 'Roommate'}'s Group`;
      targetGroup = await RoommateGroup.create({
        groupName,
        leaderId: invitation.fromUser,
        members: [invitation.fromUser, invitation.toUser]
      });
    } else {
      const targetMembers = targetGroup.members.map((member) => member.toString());

      if (!targetMembers.includes(invitation.fromUser.toString())) {
        targetGroup.members.push(invitation.fromUser);
      }

      if (!targetMembers.includes(invitation.toUser.toString())) {
        targetGroup.members.push(invitation.toUser);
      }

      await targetGroup.save();
    }

    await Promise.all([
      syncProfileGroup(invitation.fromUser, targetGroup._id, false),
      syncProfileGroup(invitation.toUser, targetGroup._id, false)
    ]);

    invitation.status = 'accepted';
    invitation.respondedAt = new Date();
    await invitation.save();

    const populatedGroup = await RoommateGroup.findById(targetGroup._id)
      .populate('leaderId', 'name email profilePicture')
      .populate('members', 'name email profilePicture');

    return res.json({ invitation, group: populatedGroup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.rejectInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const invitation = await RoommateInvitation.findById(id);

    if (!invitation || invitation.status !== 'pending' || invitation.toUser.toString() !== req.user.id) {
      return res.status(400).json({ error: 'Invalid invitation' });
    }

    invitation.status = 'rejected';
    invitation.respondedAt = new Date();
    await invitation.save();

    return res.json(invitation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
