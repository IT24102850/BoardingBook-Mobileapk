const express = require('express');
const auth = require('../middleware/auth');
const { createBooking } = require('../controllers/bookingController');

const router = express.Router();

router.post('/', auth, createBooking);

module.exports = router;
