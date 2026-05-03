const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
  try {
    const { location, minCapacity, available } = req.query;
    const query = {};

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    if (minCapacity) {
      query.capacity = { $gte: Number(minCapacity) };
    }

    if (available === 'true') {
      query.isAvailable = true;
    }

    const rooms = await Room.find(query).sort({ createdAt: -1 });
    return res.json(rooms);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    return res.json(room);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
