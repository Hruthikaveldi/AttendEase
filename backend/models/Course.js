// ═══════════════════════════════════
//   ATTENDEASE — models/Course.js
// ═══════════════════════════════════
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
  },
  total: {
    type: Number,
    required: true,
    min: [1, 'Total classes must be at least 1'],
  },
  held: {
    type: Number,
    default: 0,
    min: 0,
  },
  attended: {
    type: Number,
    default: 0,
    min: 0,
  },
  colorIdx: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Virtual: absent classes
CourseSchema.virtual('absent').get(function () {
  return this.held - this.attended;
});

// Virtual: % by held
CourseSchema.virtual('pctHeld').get(function () {
  return this.held > 0 ? parseFloat((this.attended / this.held * 100).toFixed(1)) : 0;
});

// Virtual: % by total
CourseSchema.virtual('pctTotal').get(function () {
  return this.total > 0 ? parseFloat((this.attended / this.total * 100).toFixed(1)) : 0;
});

CourseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', CourseSchema);
