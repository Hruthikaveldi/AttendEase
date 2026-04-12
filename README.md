# 🎓 AttendEase – AI-Powered Attendance Tracker

> Built with Node.js, Express, MongoDB & Vanilla JS — developed using **Claude AI (Anthropic)** via prompt engineering.

🌐 **Live Demo:** https://attendease-f10h.onrender.com  
🐙 **GitHub:** https://github.com/Hruthikaveldi/AttendEase
💻 **Ppt:** https://github.com/Hruthikaveldi/AttendEase-ppt

---

## 📁 Folder Structure

```
AttendEase-FullProject/
│
├── frontend/                   → Open with Live Server in VS Code
│   ├── index.html              → Login & Register page
│   ├── dashboard.html          → Main app (Dashboard, Courses, Analytics, Profile)
│   ├── friends.html            → Friends & Leaderboard page
│   ├── css/
│   │   ├── style.css           → Shared styles, theme tokens, buttons, forms
│   │   ├── dashboard.css       → App layout, sidebar, charts, cards
│   │   └── themes.css          → 6 color themes × dark/light mode
│   └── js/
│       ├── utils.js            → Shared helpers (theme, auth, calc, alerts)
│       ├── auth.js             → Login / Register logic
│       ├── courses.js          → Add / Edit / Delete courses + bunk planner
│       ├── charts.js           → Chart.js bar & doughnut charts
│       └── theme.js            → Multi-theme switcher panel
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
        ├── auth.js             → POST /register, POST /login, GET /me, PUT /change-password
        ├── courses.js          → GET/POST/PUT/DELETE /courses, DELETE /clear-all
        ├── timetable.js        → GET/POST/DELETE /timetable
        └── friends.js          → Friend requests, accept/reject, leaderboard
```

---

## ✨ Features

- 🔐 JWT Authentication (register, login, protected routes)
- 📚 Course management with real-time attendance calculation
- 🎯 Bunk Planner — shows Safe / Risky / Dangerous based on held %
- 📊 Analytics with Chart.js (bar chart vs 75% target, doughnut)
- 👥 Friends system — send requests by email, leaderboard comparison
- 🎨 6 color themes × dark/light mode switcher
- 🔒 Profile page with change password + danger zone

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

---

## 👩‍💻 Team — A.I. Assisted Coding | SR University

| Roll No | Name | Batch |
|---------|------|-------|
| 2303A51543 | Veldi Hruthika | BT-29 |
| 2303A51886 | Sai Spurthi Bellamkonda | BT-30 |
| 2303A51918 | Rudroju Rupa Sri | BT-30 |
| 2303A51641 | Gulluri Rithu Goud | BT-29 |
