const express = require('express');
const auth = require('../middleware/auth');
const { getRooms, getRoomById } = require('../controllers/roomController');

const router = express.Router();

router.get('/', auth, getRooms);
router.get('/:id', auth, getRoomById);

module.exports = router;
