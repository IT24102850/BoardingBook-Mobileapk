const express = require('express');
const auth = require('../middleware/auth');
const { getMyGroup, leaveGroup } = require('../controllers/roommateGroupController');

const router = express.Router();

router.get('/group/my', auth, getMyGroup);
router.delete('/group/leave', auth, leaveGroup);

module.exports = router;
