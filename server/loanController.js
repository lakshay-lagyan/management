const pool = require('./db');

// Create a new loan application
exports.applyLoan = async (req, res, next) => {
  const {
    name,
    mobile,
    city,
    company,
    income,
    salary_account,
    occupation,
    agree
  } = req.body;

  const text = `
    INSERT INTO loans
      (name, mobile, city, company, income, salary_account, occupation, agree)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [
    name,
    mobile,
    city,
    company,
    income,
    salary_account,
    occupation,
    agree
  ];

  try {
    const { rows } = await pool.query(text, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Fetch all loan applications
exports.getLoans = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM loans ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
