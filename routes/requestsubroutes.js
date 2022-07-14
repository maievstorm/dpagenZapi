const express = require('express');
const router = express.Router();
const { getRequestsub,
  getRequestsubbyUserName,
  createRequestsub,
  updateRequestsub,
  updateRequestType
} = require('../controllers/requestsub');

router.get('/', async function (req, res, next) {
  try {
    res.json(await getRequestsub(req.query.page));
  } catch (err) {
    next(err);
  }
});

router.get('/reqsubbyusername/:user_name', async function (req, res, next) {
  try {
    res.json(await getRequestsubbyUserName(req.params.user_name));
  } catch (err) {
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    res.json(await createRequestsub(req.body));
  } catch (err) {
    next(err);
  }
});



router.put('/:id', async function (req, res, next) {
  try {
    res.json(await updateRequestsub(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
});
router.put('/updateRequestType', updateRequestType)

module.exports = router;