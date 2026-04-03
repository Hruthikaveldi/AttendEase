// ═══════════════════════════════════
//   ATTENDEASE — server.js
// ═══════════════════════════════════
require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');

const app = express();

// ── MIDDLEWARE ──
// Allow both localhost variants that VS Code Live Server uses
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:5501',
  'http://localhost:5501',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// ── ROUTES ──
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/courses',   require('./routes/courses'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/friends',   require('./routes/friends'));

// ── HEALTH CHECK ──
app.get('/', (req, res) => {
  res.json({ message: '🎓 AttendEase API is running!', status: 'OK' });
});

// ── CONNECT TO MONGODB & START SERVER ──
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌐 Allowed CORS origins: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });