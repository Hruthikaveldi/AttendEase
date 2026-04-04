// ═══════════════════════════════════
//   ATTENDEASE — routes/friends.js
// ═══════════════════════════════════
const router  = require('express').Router();
const protect = require('../middleware/auth');
const User    = require('../models/User');
const Course  = require('../models/Course');

router.use(protect);

// ── GET /api/friends ── get my friends list with their attendance
router.get('/', async (req, res) => {
  try {
    const me = await User.findById(req.user.id).populate('friends', 'name email');
    if (!me) return res.status(404).json({ message: 'User not found.' });

    // For each friend, get their attendance summary
    const friendsData = await Promise.all(
      me.friends.map(async (friend) => {
        const courses   = await Course.find({ user: friend._id });
        const totalHeld = courses.reduce((s, c) => s + c.held,     0);
        const totalAtt  = courses.reduce((s, c) => s + c.attended, 0);
        const overallPct = totalHeld > 0
          ? parseFloat((totalAtt / totalHeld * 100).toFixed(1))
          : 0;
        const safeCourses = courses.filter(c =>
          c.total > 0 && (c.attended / c.total * 100) >= 75
        ).length;

        return {
          id:          friend._id,
          name:        friend.name,
          email:       friend.email,
          totalCourses: courses.length,
          overallPct,
          safeCourses,
          courses: courses.map(c => ({
            name:      c.name,
            total:     c.total,
            held:      c.held,
            attended:  c.attended,
            remaining: c.total - c.held,
            pctHeld:   c.held  > 0 ? parseFloat((c.attended / c.held  * 100).toFixed(1)) : 0,
            pctTotal:  c.total > 0 ? parseFloat((c.attended / c.total * 100).toFixed(1)) : 0,
          })),
        };
      })
    );

    // Sort by overallPct DESC (leaderboard!)
    friendsData.sort((a, b) => b.overallPct - a.overallPct);

    res.json(friendsData);
  } catch (err) {
    console.error('Get friends error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/friends/request ── send a friend request by email
router.post('/request', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const target = await User.findOne({ email: email.toLowerCase() });
    if (!target)
      return res.status(404).json({ message: 'No user found with this email.' });

    if (target._id.toString() === req.user.id)
      return res.status(400).json({ message: "You can't add yourself!" });

    // Check if already friends
    const me = await User.findById(req.user.id);
    if (me.friends.includes(target._id))
      return res.status(400).json({ message: 'Already friends!' });

    // Check if request already sent
    const alreadySent = target.friendRequests.find(
      r => r.from.toString() === req.user.id && r.status === 'pending'
    );
    if (alreadySent)
      return res.status(400).json({ message: 'Friend request already sent!' });

    // Add request to target's list
    target.friendRequests.push({ from: req.user.id, status: 'pending' });
    await target.save();

    res.json({ message: `Friend request sent to ${target.name}!` });
  } catch (err) {
    console.error('Friend request error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/friends/requests ── get my pending friend requests
router.get('/requests', async (req, res) => {
  try {
    const me = await User.findById(req.user.id)
      .populate('friendRequests.from', 'name email');

    const pending = me.friendRequests.filter(r => r.status === 'pending');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/friends/respond ── accept or reject a friend request
router.post('/respond', async (req, res) => {
  try {
    const { requestId, action } = req.body; // action: 'accept' or 'reject'

    if (!requestId || !action)
      return res.status(400).json({ message: 'requestId and action are required.' });

    const me = await User.findById(req.user.id);
    const request = me.friendRequests.id(requestId);

    if (!request)
      return res.status(404).json({ message: 'Request not found.' });

    if (action === 'accept') {
      request.status = 'accepted';

      // Add each other as friends
      if (!me.friends.includes(request.from)) {
        me.friends.push(request.from);
      }
      await me.save();

      // Add me to their friends too
      await User.findByIdAndUpdate(request.from, {
        $addToSet: { friends: me._id }
      });

      res.json({ message: 'Friend request accepted! 🎉' });
    } else {
      request.status = 'rejected';
      await me.save();
      res.json({ message: 'Friend request rejected.' });
    }
  } catch (err) {
    console.error('Respond error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE /api/friends/:id ── remove a friend
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { friends: req.params.id }
    });
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { friends: req.user.id }
    });
    res.json({ message: 'Friend removed.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;