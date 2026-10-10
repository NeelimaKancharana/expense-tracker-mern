# Expense Tracker

A full-stack MERN application for tracking personal income and expenses, with a dashboard that summarises your finances through charts and bar graphs over different time periods.

**Live demo:** https://expense-tracker-app-eight-kappa.vercel.app

> Note: the backend runs on a free Render plan, so the first request after a period of inactivity can take up to a minute while the server wakes up.

## Features

- User registration and login with JWT authentication
- Passwords hashed with bcrypt
- Add, edit and delete income entries
- Add, edit and delete expense entries
- Dashboard with financial summary cards and an overview of income versus expenses
- Charts and bar graphs to visualise income and expenses
- Filter transactions by time frame
- Export income and expense data to Excel
- Profile page
- Protected routes and protected API endpoints
- Responsive UI

## Tech Stack

**Frontend:** React (Vite), React Router, interactive charts and bar graphs

**Backend:** Node.js, Express, MongoDB with Mongoose, JSON Web Tokens, bcryptjs, validator, dotenv, CORS, xlsx

**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## API Routes

| Route group | Purpose |
|-------------|---------|
| `/api/user` | Registration, login and profile |
| `/api/income` | Create, read, update and delete income records |
| `/api/expense` | Create, read, update and delete expense records |
| `/api/dashboard` | Summary data for the dashboard |

Income, expense and dashboard routes require a valid JWT in the `Authorization: Bearer <token>` header.

## Project Structure

```
expense_tracker_mern/
├── backend/
│   ├── config/         # database connection
│   ├── controllers/    # user, income, expense and dashboard logic
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # date filter helper
│   └── server.js
└── frontend/
    └── src/
        ├── assets/
        ├── components/ # Navbar, Sidebar, cards, charts, forms, login and signup
        ├── pages/      # Dashboard, Income, Expense, Profile
        └── utils/      # export helpers
```

## Running Locally

### Prerequisites
- Node.js 18 or higher
- A MongoDB Atlas database (or a local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/NeelimaKancharana/expense-tracker-mern.git
cd expense-tracker-mern
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `backend/.env` file:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Start the server (runs on port 4000):
```bash
npm start
```

### 3. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173`. By default it calls the backend at `http://localhost:4000`. To use a different backend, create `frontend/.env`:
```
VITE_API_URL=https://your-backend-url
```

## What I Learned

- Designing a REST API with separate routes, controllers and models
- Protecting routes with JWT authentication middleware
- Filtering and aggregating data by date range for dashboard summaries
- Visualising financial data with charts and bar graphs
- Exporting data to Excel with the xlsx library
- Keeping secrets out of source code with environment variables
- Deploying a full-stack app with Vercel, Render and MongoDB Atlas

## Author

**Neelima Kancharana** - [GitHub](https://github.com/NeelimaKancharana)