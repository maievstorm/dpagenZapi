const express = require('express');
const router = express.Router();
const { getInvoice, createInvoice } = require('../controllers/invoice');

/* GET invoice list */
router.get('/', async function(req, res, next) {
  try {
    res.json(await getInvoice(req.query.page));
  } catch (err) {
    next(err);
  }
});


/* POST invoice */
router.post('/', async function(req, res, next) {
  try {
    res.json(await createInvoice(req.body));
  } catch (err) {
    next(err);
  }
});

module.exports = router;