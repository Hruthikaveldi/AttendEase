// ═══════════════════════════════════
//   ATTENDEASE — models/Timetable.js
// ═══════════════════════════════════
const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  courseName: { type: String, required: true, trim: true },
  startTime:  { type: String, required: true }, // e.g. "09:00"
  endTime:    { type: String, required: true }, // e.g. "10:00"
  room:       { type: String, default: '' },
}, { _id: true });

const TimetableSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // one timetable per user
  },
  monday:    [SlotSchema],
  tuesday:   [SlotSchema],
  wednesday: [SlotSchema],
  thursday:  [SlotSchema],
  friday:    [SlotSchema],
  saturday:  [SlotSchema],
}, { timestamps: true });

module.exports = mongoose.model('Timetable', TimetableSchema);
