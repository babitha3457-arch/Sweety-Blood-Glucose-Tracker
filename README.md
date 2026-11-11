# Sweety – Blood Glucose Tracker

A full-stack web application that helps users securely record, manage, and monitor their blood glucose readings.

## Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Add, view, edit, and delete glucose readings
- Four daily time slots:
  - Morning
  - After breakfast
  - After lunch
  - After dinner
- Input validation (40–600 mg/dL)
- Prevent duplicate readings for the same date and time slot
- Daily, month-to-date, and previous-month reports
- Highest, lowest, and average glucose summaries
- User-specific reading access

## Technologies Used

**Frontend:** React.js, Vite, CSS

**Backend:** Node.js, Express.js

**Database:** PostgreSQL (Neon)

**Authentication:** JWT and bcryptjs

## Project Structure

- `client/` – React frontend
- `server/` – Express backend and database configuration
- `server/routes/` – Authentication, readings, and reports routes
- `server/schema.sql` – Database table definitions
- `server/seed.js` – Sample data script
- `server/.env.example` – Environment variable template

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/babitha3457-arch/Sweety-Blood-Glucose-Tracker.git
cd Sweety-Blood-Glucose-Tracker
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file using `.env.example` and configure:

```env
PORT=5000
DATABASE_URL=your_neon_database_connection_string
JWT_SECRET=your_secret_key
```

### 3. Database Setup

- Create a PostgreSQL database using Neon.
- Open the Neon SQL Editor.
- Execute the SQL statements from `schema.sql`.
- Add your database connection string to `server/.env`.

### 4. Start the Backend

```bash
npm start
```

The backend runs on:

`http://localhost:5000`

### 5. Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

`http://localhost:5173`

## Sample Data

To insert sample data into the database:

```bash
cd server
npm run seed
```

## Testing

The application was manually tested for:

- User registration and login
- Adding, editing, and deleting readings
- Duplicate reading prevention
- Minimum and maximum glucose value validation
- Prevention of future dates
- Maximum four readings per day
- Daily and monthly reports
- User-specific data access

Automated test cases are not configured yet.

## GitHub Repository

https://github.com/babitha3457-arch/Sweety-Blood-Glucose-Tracker

## Developer

**Babitha M**

BCA Graduate




## Notes

### Assumptions
- Each user can manage only their own glucose readings.
- A maximum of four readings is allowed per day.
- Glucose values must be whole numbers between 40 and 600 mg/dL.
- Future dates are not allowed.

### Future Improvements
- Add graphical charts to visualize glucose trends.
- Implement automated backend and frontend tests.
- Improve dashboard design and mobile responsiveness.