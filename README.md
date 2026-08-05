# Track — Agency & Freelance Project Management Platform

Role-based project management system for agencies and freelancers — real-time workload tracking, milestone management, trust scoring, and invoicing.

[**Live Demo**](https://track-ten-lilac.vercel.app) · [**API Docs**](#) · [**Video Walkthrough**](#)

<!-- Add API docs / video links if you have them -->

![Track dashboard screenshot](./docs/screenshot-dashboard.png)
<!-- Add 2-3 real screenshots/GIFs here: dashboard, workload view, milestone tracker -->

---

## Why this exists

Agencies managing multiple freelancers run into the same three problems repeatedly:
- No shared visibility into who's overloaded and who has capacity
- Milestones and deadlines tracked in spreadsheets or chat threads, not the system of record
- No structured way to build trust between clients and freelancers across projects

Track addresses this with role-based dashboards, a workload/availability engine, and a two-way rating system — instead of leaving it to ad hoc communication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Architecture | REST APIs, RBAC |
| Deployment | Frontend on Vercel, Backend on Render |

<!-- Add Socket.io here only if real-time notifications are actually implemented in code, not just planned -->
<!-- Do not list Razorpay/PDFKit — payment gateway integration is still on the roadmap, not shipped -->
| Charting | Chart.js |

---

## Architecture

```
Client (React SPA)
   │  REST + JWT
   ▼
Express API
   │
   └── MongoDB (projects, users, milestones, ratings)
```

<!-- Replace with an actual diagram (Excalidraw/draw.io export) once you have one -->

---

## Core Features

**Role-based access** — Client, Freelancer, Agency Owner each get a scoped dashboard and permission set (RBAC), not just a shared UI with hidden buttons.

**Project & milestone tracking** — Milestone status (Due / In Progress / Overdue) computed from deadlines and update timestamps, not manually set.

**Workload engine** — Each freelancer's Available / Busy / Overloaded status is derived from active project count and milestone density, recalculated on assignment. This is the core logic that differentiates the app from a plain task board.

**Trust score** — Two-way ratings (client ↔ freelancer) roll up into a Reliable / Average / Risky indicator based on delivery history.

**Notifications & reminders** — Deadline alerts, feedback-pending reminders, and event-driven backend logic surface status changes to the right role.

<!-- If notifications are polling-based rather than WebSocket-pushed, don't imply "real-time" — describe what's actually implemented -->

**AI-assisted insights** *(optional — only keep this section if it's actually implemented and callable)*
- Freelancer recommendation based on skills + current workload + trust score
- Project risk flagging (Low/Medium/High)
- Feedback summarization into actionable points

> If these aren't wired to a real model/API call yet, cut this section or label it "planned" — an unverifiable AI claim in a portfolio README costs more credibility than it earns.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB instance (local or Atlas)
- Razorpay test API keys

### Setup

```bash
git clone https://github.com/sonichanchal702/track.git
cd track

# Backend
cd backend
npm install
cp .env.example .env   # fill in values below
npm run dev             # runs on http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev              # runs on http://localhost:5173
```

### Environment variables

**backend/.env**
```
PORT=5000
MONGO_URI=
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000
```

<!-- Confirm these match your actual env var names in the code -->

---

## API Overview

<!-- Fill with your real routes. Example structure below — replace with what you actually built -->

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user (client/freelancer/agency) |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/projects` | List projects (scoped by role) |
| POST | `/api/projects` | Create project |
| PATCH | `/api/projects/:id/milestones/:mid` | Update milestone status |
| GET | `/api/workload/:userId` | Get computed workload status |
| POST | `/api/ratings` | Submit a rating |

<!-- Replace this whole table with your actual routes — verify against backend/routes before publishing -->

---

## What this project demonstrates

- Designing role-based access control from the data model up, not just the UI
- Deriving system state (workload, trust score, risk) from underlying data rather than storing it as a flat field
- Structuring business logic beyond CRUD (milestone status derivation, trust scoring)
- Deploying a split frontend/backend app across two platforms with correct CORS/env handling

---

## Roadmap

- [ ] Payment gateway integration
- [ ] Calendar sync
- [ ] Advanced analytics dashboard for agency owners
- [ ] AI-based workload forecasting
- [ ] Automated testing (Jest + Supertest for backend)

---

## License

<!-- Add a license, e.g. MIT — currently missing -->
