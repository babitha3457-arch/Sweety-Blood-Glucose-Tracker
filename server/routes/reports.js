const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

router.use(authenticateToken);

// DAILY REPORT
router.get("/daily", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    const result = await pool.query(
      `SELECT 
        COUNT(*) AS count,
        MAX(value) AS highest,
        MIN(value) AS lowest,
        ROUND(AVG(value)::numeric, 1) AS average
       FROM readings
       WHERE user_id = $1 AND reading_date = $2`,
      [req.user.id, date]
    );

    const readings = await pool.query(
      `SELECT id, reading_date, time_slot, value
       FROM readings
       WHERE user_id = $1 AND reading_date = $2
       ORDER BY id`,
      [req.user.id, date]
    );

    res.json({
      summary: result.rows[0],
      readings: readings.rows
    });

  } catch (error) {
    res.status(500).json({ message: "Could not generate daily report." });
  }
});

// MONTH-TO-DATE REPORT
router.get("/month-to-date", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    const result = await pool.query(
      `SELECT
        COUNT(*) AS count,
        MAX(value) AS highest,
        MIN(value) AS lowest,
        ROUND(AVG(value)::numeric, 1) AS average
       FROM readings
       WHERE user_id = $1
       AND reading_date >= DATE_TRUNC('month', $2::date)
       AND reading_date <= $2::date`,
      [req.user.id, date]
    );

    res.json({
  summary: result.rows[0],
  readings: []
});

  } catch (error) {
    res.status(500).json({ message: "Could not generate monthly report." });
  }
});

// PREVIOUS MONTH REPORT
router.get("/previous-month", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    const result = await pool.query(
      `SELECT
        COUNT(*) AS count,
        MAX(value) AS highest,
        MIN(value) AS lowest,
        ROUND(AVG(value)::numeric, 1) AS average
       FROM readings
       WHERE user_id = $1
       AND reading_date >= DATE_TRUNC('month', $2::date) - INTERVAL '1 month'
       AND reading_date < DATE_TRUNC('month', $2::date)`,
      [req.user.id, date]
    );

    res.json({
  summary: result.rows[0],
  readings: []
});

  } catch (error) {
    res.status(500).json({ message: "Could not generate previous month report." });
  }
});

module.exports = router;