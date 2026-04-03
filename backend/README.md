# 🎓 AttendEase — Backend Setup Guide

## 📁 Folder Structure
```
AttendEase-Backend/
├── server.js            → Main entry point
├── .env                 → Your secret config (fill this!)
├── .gitignore
├── package.json
├── middleware/
│   └── auth.js          → JWT token checker
├── models/
│   ├── User.js          → User schema
│   ├── Course.js        → Course schema
│   └── Timetable.js     → Timetable schema
└── routes/
    ├── auth.js          → Login / Register
    ├── courses.js       → Course CRUD
    ├── timetable.js     → Timetable CRUD
    └── friends.js       → Friends & Leaderboard
```

---

## ⚡ Step 1 — Install Dependencies

Open terminal inside the `AttendEase-Backend` folder and run:

```bash
npm install
```

---

## 🍃 Step 2 — Set Up MongoDB (Free!)

1. Go to **https://cloud.mongodb.com**
2. Sign up for free
3. Click **"Create a free cluster"** (M0 free tier)
4. Choose any region → Click **Create**
5. Go to **Database Access** → Add a new user with username & password
6. Go to **Network Access** → Click **"Allow Access from Anywhere"** (0.0.0.0/0)
7. Go to your cluster → Click **"Connect"**
8. Choose **"Connect your application"**
9. Copy the connection string — looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/
   ```

---

## 🔐 Step 3 — Fill in your .env file

Open `.env` and fill in:

```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/attendease?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_you_make_up
PORT=5000
FRONTEND_URL=http://127.0.0.1:5500
```

> ⚠️ Replace `youruser` and `yourpassword` with what you set in MongoDB!

---

## 🚀 Step 4 — Run the Server

```bash
# For development (auto-restarts on changes)
npm run dev

# For production
npm start
```

You should see:
```
✅ MongoDB connected!
🚀 Server running on http://localhost:5000
```

---

## 🧪 Step 5 — Test the API

Open your browser and go to:
```
http://localhost:5000
```

You should see:
```json
{ "message": "🎓 AttendEase API is running!", "status": "OK" }
```

---

## 📡 API Endpoints Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user (needs token) |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/courses | Get all my courses |
| POST   | /api/courses | Add a course |
| PUT    | /api/courses/:id | Update a course |
| DELETE | /api/courses/:id | Delete a course |

### Timetable
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/timetable | Get full timetable |
| GET    | /api/timetable/today | Get today's classes |
| POST   | /api/timetable/slot | Add a class slot |
| DELETE | /api/timetable/slot | Remove a class slot |

### Friends
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/friends | Get friends + their attendance |
| POST   | /api/friends/request | Send friend request by email |
| GET    | /api/friends/requests | Get pending requests |
| POST   | /api/friends/respond | Accept or reject request |
| DELETE | /api/friends/:id | Remove a friend |

---

## 🔗 Connecting Frontend to Backend

In your frontend JS files, replace `localStorage` calls with `fetch()` to the API.

Example — Login:
```javascript
const res = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await res.json();
localStorage.setItem('ae_token', data.token); // save token
```

Example — Get Courses (protected):
```javascript
const token = localStorage.getItem('ae_token');
const res = await fetch('http://localhost:5000/api/courses', {
  headers: { 'Authorization': 'Bearer ' + token }
});
const courses = await res.json();
```

---

## 🚀 Free Deployment

| Service | What for | Link |
|---------|----------|------|
| **Railway** | Deploy Node.js backend | railway.app |
| **Render** | Free Node.js hosting | render.com |
| **Netlify** | Deploy frontend | netlify.com |
| **MongoDB Atlas** | Free database | cloud.mongodb.com |

---

## ❓ Common Errors

| Error | Fix |
|-------|-----|
| `MongoDB connection failed` | Check your MONGO_URI in .env |
| `Cannot find module` | Run `npm install` again |
| `Port already in use` | Change PORT in .env to 5001 |
| `CORS error in browser` | Check FRONTEND_URL in .env matches your frontend |
