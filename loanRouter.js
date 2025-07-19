const express = require('express');
const router  = express.Router();
const loanController = require('./loanController');

// Apply for a new loan
router.post('/', loanController.applyLoan);

// List all loans
router.get('/', loanController.getLoans);

module.exports = router;
