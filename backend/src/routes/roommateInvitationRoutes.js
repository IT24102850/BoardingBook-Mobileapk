const express = require('express');
const auth = require('../middleware/auth');
const {
  sendInvitation,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation
} = require('../controllers/roommateInvitationController');

const router = express.Router();

router.post('/invite', auth, sendInvitation);
router.get('/invitations', auth, getMyInvitations);
router.put('/invite/:id/accept', auth, acceptInvitation);
router.put('/invite/:id/reject', auth, rejectInvitation);

module.exports = router;
