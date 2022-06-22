const express = require('express');
const router = express.Router();
const { getChecksong } = require('../controllers/checksong');


router.get('/', async function(req, res, next) {
  try {
    res.json(await getChecksong(req.query.page));
  } catch (err) {
    next(err);
  }
});

module.exports = router;