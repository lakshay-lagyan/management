const express = require('express');
const router  = express.Router();
const loanController = require('./loanController');

router.post  ('/apply',         loanController.applyLoan);
router.get   ('/loans',         loanController.getLoans);
router.post  ('/:id/pay',       loanController.payLoan);
router.get   ('/:id/payments',  loanController.getLoanPayments);
router.patch ('/:id/status',    loanController.updateLoanStatus);

module.exports = router;
