// ═══════════════════════════════════
//   ATTENDEASE — routes/timetable.js
// ═══════════════════════════════════
const router    = require('express').Router();
const protect   = require('../middleware/auth');
const Timetable = require('../models/Timetable');

router.use(protect);

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday'];

// ── GET /api/timetable ── get user's full timetable
router.get('/', async (req, res) => {
  try {
    let timetable = await Timetable.findOne({ user: req.user.id });

    // If no timetable yet, return empty one
    if (!timetable) {
      timetable = { monday:[], tuesday:[], wednesday:[], thursday:[], friday:[], saturday:[] };
    }

    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/timetable/slot ── add a class slot to a day
router.post('/slot', async (req, res) => {
  try {
    const { day, courseName, startTime, endTime, room } = req.body;

    if (!day || !courseName || !startTime || !endTime)
      return res.status(400).json({ message: 'Day, course name, start and end time are required.' });

    if (!DAYS.includes(day.toLowerCase()))
      return res.status(400).json({ message: 'Invalid day. Use monday to saturday.' });

    let timetable = await Timetable.findOne({ user: req.user.id });
    if (!timetable) {
      timetable = new Timetable({ user: req.user.id });
    }

    timetable[day.toLowerCase()].push({ courseName, startTime, endTime, room: room || '' });
    await timetable.save();

    res.status(201).json(timetable);
  } catch (err) {
    console.error('Add slot error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE /api/timetable/slot ── remove a slot
router.delete('/slot', async (req, res) => {
  try {
    const { day, slotId } = req.body;

    if (!day || !slotId)
      return res.status(400).json({ message: 'Day and slotId are required.' });

    const timetable = await Timetable.findOne({ user: req.user.id });
    if (!timetable)
      return res.status(404).json({ message: 'Timetable not found.' });

    timetable[day.toLowerCase()] = timetable[day.toLowerCase()].filter(
      slot => slot._id.toString() !== slotId
    );

    await timetable.save();
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/timetable/today ── get today's classes only
router.get('/today', async (req, res) => {
  try {
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const today = days[new Date().getDay()];

    const timetable = await Timetable.findOne({ user: req.user.id });
    if (!timetable || today === 'sunday')
      return res.json({ day: today, slots: [] });

    const slots = timetable[today] || [];
    // Sort by startTime
    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json({ day: today, slots });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
