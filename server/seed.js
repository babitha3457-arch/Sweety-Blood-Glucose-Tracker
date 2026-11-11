
require("dotenv").config();

const pool = require("./db");
const bcrypt = require("bcryptjs");

async function seedDatabase() {
  try {
    const name = "Demo User";
    const email = "seed@example.com";
    const password = "DemoPass123";

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name
       RETURNING id`,
      [name, email, hashedPassword]
    );

    const userId = userResult.rows[0].id;

    const samples = [
      ["Morning", 110],
      ["After breakfast", 130],
      ["After lunch", 145],
      ["After dinner", 125]
    ];

    for (const [slot, value] of samples) {
      await pool.query(
        `INSERT INTO readings (user_id, reading_date, time_slot, value)
         VALUES ($1, CURRENT_DATE, $2, $3)
         ON CONFLICT (user_id, reading_date, time_slot)
         DO NOTHING`,
        [userId, slot, value]
      );
    }

    console.log("Sample data added successfully!");
    console.log("Email:", email);
    console.log("Password:", password);

  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await pool.end();
  }
}

seedDatabase();
