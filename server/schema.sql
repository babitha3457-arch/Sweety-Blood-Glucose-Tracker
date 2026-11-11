
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE readings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reading_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    value INTEGER NOT NULL CHECK (value BETWEEN 40 AND 600),

    CONSTRAINT valid_slot CHECK (
        time_slot IN (
            'Morning',
            'After breakfast',
            'After lunch',
            'After dinner'
        )
    ),

    CONSTRAINT unique_daily_slot
        UNIQUE (user_id, reading_date, time_slot)
);
