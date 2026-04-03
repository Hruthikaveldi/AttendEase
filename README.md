# 🎓 AttendEase – Full Project

## 📁 Folder Structure

```
AttendEase-FullProject/
│
├── frontend/                   → Open with Live Server in VS Code
│   ├── index.html              → Login & Register page
│   ├── dashboard.html          → Main app (Dashboard, Courses, Analytics, Profile)
│   ├── css/
│   │   ├── style.css           → Shared styles, theme, buttons, forms
│   │   └── dashboard.css       → App layout, sidebar, charts, cards
│   └── js/
│       ├── utils.js            → Shared helpers (theme, auth, calc, alerts)
│       ├── auth.js             → Login / Register logic
│       ├── courses.js          → Add / Edit / Delete courses + bunk calc
│       └── charts.js           → Chart.js bar & doughnut charts
│
└── backend/                    → Node.js + MongoDB REST API
    ├── server.js               → Main Express server
    ├── package.json            → npm dependencies
    ├── .env                    → 🔴 Fill in YOUR MongoDB URI & JWT secret
    ├── .gitignore
    ├── README.md               → Full backend setup guide
    ├── middleware/
    │   └── auth.js             → JWT token protection
    ├── models/
    │   ├── User.js             → User schema (name, email, password, friends)
    │   ├── Course.js           → Course schema (with virtual % fields)
    │   └── Timetable.js        → Weekly timetable schema
    └── routes/
        ├── auth.js             → POST /register, POST /login, GET /me
        ├── courses.js          → GET/POST/PUT/DELETE /courses
        ├── timetable.js        → GET/POST/DELETE /timetable
        └── friends.js          → Friend requests, accept/reject, leaderboard

```

---

## ▶️ Run Frontend (No setup needed!)

1. Open `frontend/` folder in VS Code
2. Right click `index.html` → **Open with Live Server**
3. Register → Login → Start using! ✅

> Frontend uses **localStorage** — works perfectly without backend for personal use.

---

## ▶️ Run Backend

1. Open `backend/` folder in VS Code terminal
2. Fill in your `.env` file (see `backend/README.md` for MongoDB setup)
3. Run:
```bash
npm install
npm run dev
```
4. Server runs on `http://localhost:5000` ✅

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML5, CSS3, JavaScript, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + Bcryptjs |
| AI Tool | Claude AI (Anthropic) |

