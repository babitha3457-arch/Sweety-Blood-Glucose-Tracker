
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
console.log("Readings route loaded successfully!");

router.use(authenticateToken);

const slots = [
  "Morning",
  "After breakfast",
  "After lunch",
  "After dinner"
];

function validDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return false;

  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;
}

function futureDate(date) {
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  return date > localToday;
}

// VIEW READINGS
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM readings
       WHERE user_id = $1
       ORDER BY reading_date DESC, id DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch readings." });
  }
});

// ADD READING
router.post("/", async (req, res) => {
  try {
    const { date, time_slot, value } = req.body;

    if (value === undefined || value === null || value === "") {
      return res.status(400).json({
        message: "Please enter a glucose value."
      });
    }

    if (!Number.isInteger(Number(value)) ||
        Number(value) < 40 || Number(value) > 600) {
      return res.status(400).json({
        message: "Value must be between 40 and 600 mg/dl."
      });
    }

    if (!validDate(date)) {
      return res.status(400).json({
        message: "Please enter a valid date."
      });
    }

    if (futureDate(date)) {
      return res.status(400).json({
        message: "Date cannot be in the future."
      });
    }

    if (!slots.includes(time_slot)) {
      return res.status(400).json({
        message: "Please select a valid time slot."
      });
    }

    const count = await pool.query(
      `SELECT COUNT(*) FROM readings
       WHERE user_id = $1 AND reading_date = $2`,
      [req.user.id, date]
    );

    if (Number(count.rows[0].count) >= 4) {
      return res.status(400).json({
        message: "You can add only 4 readings per day."
      });
    }

    const result = await pool.query(
      `INSERT INTO readings
       (user_id, reading_date, time_slot, value)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, date, time_slot, Number(value)]
    );

    res.status(201).json({
      message: "Reading added successfully!",
      reading: result.rows[0]
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: `You already have an ${req.body.time_slot} reading for this date.`
      });
    }

    res.status(500).json({ message: "Could not add reading." });
  }
});

// EDIT READING
router.put("/:id", async (req, res) => {
  try {
    const { date, time_slot, value } = req.body;

    if (value === undefined || value === null || value === "") {
      return res.status(400).json({
        message: "Please enter a glucose value."
      });
    }

    if (!Number.isInteger(Number(value)) ||
        Number(value) < 40 || Number(value) > 600) {
      return res.status(400).json({
        message: "Value must be between 40 and 600 mg/dl."
      });
    }

    if (!validDate(date)) {
      return res.status(400).json({
        message: "Please enter a valid date."
      });
    }

    if (futureDate(date)) {
      return res.status(400).json({
        message: "Date cannot be in the future."
      });
    }

    if (!slots.includes(time_slot)) {
      return res.status(400).json({
        message: "Please select a valid time slot."
      });
    }

    const result = await pool.query(
      `UPDATE readings
       SET reading_date = $1, time_slot = $2, value = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [date, time_slot, Number(value), req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Reading not found."
      });
    }

    res.json({
      message: "Reading updated successfully!",
      reading: result.rows[0]
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: `You already have an ${req.body.time_slot} reading for this date.`
      });
    }

    res.status(500).json({ message: "Could not update reading." });
  }
});

// DELETE READING
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM readings
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Reading not found."
      });
    }

    res.json({ message: "Reading deleted successfully!" });

  } catch (error) {
    res.status(500).json({ message: "Could not delete reading." });
  }
});

module.exports = router;
