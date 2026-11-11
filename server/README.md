
# Sweety - Blood Glucose Tracker

A full-stack web application that helps users record, manage, and monitor their daily blood glucose readings.

## Features

- User signup and login
- Secure password hashing using bcrypt
- JWT authentication
- Add, view, edit and delete glucose readings
- Four daily time slots:
  - Morning
  - After breakfast
  - After lunch
  - After dinner
- Reading validation (40–600 mg/dL)
- Prevent duplicate readings for the same date and slot
- Daily report
- Month-to-date report
- Previous month report
- User-specific reading history

## Technologies Used

**Frontend:** React.js, CSS, Vite

**Backend:** Node.js, Express.js

**Database:** PostgreSQL (Neon)

**Authentication:** bcryptjs, JSON Web Token

## Project Structure

- client - React frontend
- server - Node.js and Express backend
- server/routes - API routes
- server/middleware - Authentication middleware

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Sweety-Blood-Glucose-Tracker
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file using `.env.example` and add your database connection string and JWT secret.

Run the database SQL schema in your PostgreSQL database.

Start the backend:

```bash
node server.js
```

### 3. Frontend setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite.

## Database

The application uses PostgreSQL with two main tables:

- users
- readings

## Testing

Tested signup, login, CRUD operations, reading validation, duplicate prevention, daily limit and report generation.

## Author

BCA Graduate
