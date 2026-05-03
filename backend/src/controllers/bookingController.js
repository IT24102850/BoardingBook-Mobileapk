const Booking = require('../models/Booking');
const Room = require('../models/Room');
const RoommateGroup = require('../models/RoommateGroup');

exports.createBooking = async (req, res) => {
  try {
    const { roomId, groupId, startDate, endDate } = req.body;

    if (!roomId || !startDate || !endDate) {
      return res.status(400).json({ error: 'roomId, startDate, and endDate are required' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    let group = null;
    let members = [req.user.id];

    if (groupId) {
      group = await RoommateGroup.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      if (group.leaderId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Only the group leader can create a booking' });
      }

      if (group.members.length > room.capacity) {
        return res.status(400).json({ error: 'Group size exceeds room capacity' });
      }

      members = group.members;
    }

    const booking = await Booking.create({
      roomId,
      groupId,
      bookedBy: req.user.id,
      members,
      startDate,
      endDate,
      status: 'pending'
    });

    if (group) {
      group.bookingId = booking._id;
      await group.save();
    }

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
