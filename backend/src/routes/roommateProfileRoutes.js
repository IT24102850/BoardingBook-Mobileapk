const express = require('express');
const auth = require('../middleware/auth');
const { upsertProfile, getMyProfile, searchRoommates } = require('../controllers/roommateProfileController');

const router = express.Router();

router.post('/profile', auth, upsertProfile);
router.get('/profile/me', auth, getMyProfile);
router.get('/search', auth, searchRoommates);

module.exports = router;
