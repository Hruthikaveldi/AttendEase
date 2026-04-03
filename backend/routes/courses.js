// ═══════════════════════════════════
//   ATTENDEASE — routes/courses.js
// ═══════════════════════════════════
const router  = require('express').Router();
const protect = require('../middleware/auth');
const Course  = require('../models/Course');

// All routes are protected
router.use(protect);

// ── GET /api/courses ── get all courses for logged-in user
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/courses ── add a new course
router.post('/', async (req, res) => {
  try {
    const { name, total, held, attended, colorIdx } = req.body;

    if (!name || !total)
      return res.status(400).json({ message: 'Course name and total classes are required.' });

    if (held > total)
      return res.status(400).json({ message: 'Classes held cannot exceed total classes.' });

    if (attended > held)
      return res.status(400).json({ message: 'Attended cannot exceed classes held.' });

    const course = await Course.create({
      user: req.user.id,
      name,
      total,
      held:      held      || 0,
      attended:  attended  || 0,
      colorIdx:  colorIdx  || 0,
    });

    res.status(201).json(course);
  } catch (err) {
    console.error('Add course error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── PUT /api/courses/:id ── update a course
router.put('/:id', async (req, res) => {
  try {
    const { name, total, held, attended } = req.body;

    const course = await Course.findOne({ _id: req.params.id, user: req.user.id });
    if (!course)
      return res.status(404).json({ message: 'Course not found.' });

    if (held > total)
      return res.status(400).json({ message: 'Classes held cannot exceed total.' });

    if (attended > held)
      return res.status(400).json({ message: 'Attended cannot exceed classes held.' });

    course.name     = name     ?? course.name;
    course.total    = total    ?? course.total;
    course.held     = held     ?? course.held;
    course.attended = attended ?? course.attended;

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE /api/courses/:id ── delete a course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!course)
      return res.status(404).json({ message: 'Course not found.' });

    res.json({ message: 'Course deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
