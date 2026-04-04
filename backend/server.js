// ═══════════════════════════════════
//   ATTENDEASE — server.js
// ═══════════════════════════════════
require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const path      = require('path');

const app = express();

// ── MIDDLEWARE ──
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ── API ROUTES ──
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/courses',   require('./routes/courses'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/friends',   require('./routes/friends'));

// ── SERVE FRONTEND STATIC FILES ──
// Goes up one level from backend/ to reach frontend/
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── CATCH-ALL: serve index.html for any unknown route ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── CONNECT TO MONGODB & START SERVER ──
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend served at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });