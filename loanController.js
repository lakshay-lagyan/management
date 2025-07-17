const pool = require('../config/db');

// Apply for a new loan
exports.applyLoan = async (req, res, next) => {
  const { name, amount, term_months, interest_rate } = req.body;
  const text = `
    INSERT INTO loan (name, amount, term_months, interest_rate)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  try {
    const { rows } = await pool.query(text, [name, amount, term_months, interest_rate]);
    res.status(201).json({ loan: rows[0] });
  } catch (err) {
    next(err);
  }
};

// Get all loans
exports.getLoans = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM loan ORDER BY created_at DESC');
    res.json({ loans: rows });
  } catch (err) {
    next(err);
  }
};

// Pay an installment for a loan
exports.payLoan = async (req, res, next) => {
  const loanId = parseInt(req.params.id, 10);
  const { amount_paid } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verify loan exists
    const loanRes = await client.query(
      'SELECT id, status FROM loan WHERE id = $1 FOR UPDATE',
      [loanId]
    );
    if (loanRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Insert payment
    const payText = `
      INSERT INTO loan_payment (loan_id, amount_paid)
      VALUES ($1, $2) RETURNING *;
    `;
    const { rows } = await client.query(payText, [loanId, amount_paid]);

    // Optionally update loan status if fully paid
    // await client.query('UPDATE loan SET status = $1 WHERE id = $2', ['paid', loanId]);

    await client.query('COMMIT');
    res.status(201).json({ payment: rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// Get all payments for a loan
exports.getLoanPayments = async (req, res, next) => {
  const loanId = parseInt(req.params.id, 10);
  const text = `
    SELECT id, amount_paid, paid_at
      FROM loan_payment
     WHERE loan_id = $1
  `;
  try {
    const { rows } = await pool.query(text, [loanId]);
    res.json({ payments: rows });
  } catch (err) {
    next(err);
  }
};

// Update loan status (approve/reject)
exports.updateLoanStatus = async (req, res, next) => {
  const loanId = parseInt(req.params.id, 10);
  const { status } = req.body; // expected: 'approved' or 'rejected'
  const text = `
    UPDATE loan
       SET status = $1
     WHERE id = $2
 RETURNING *;
  `;
  try {
    const { rows } = await pool.query(text, [status, loanId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Loan not found' });
    res.json({ loan: rows[0] });
  } catch (err) {
    next(err);
  }
};
