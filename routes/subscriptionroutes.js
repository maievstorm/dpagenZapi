const express = require('express');
const router = express.Router();
const { getSubscription, getSubscriptionbyUserName, createSubscription, updateSubscription,
  createSubscriptionforAccountandGroup,
  createSubscriptionforGroup,
  getUserSubscription
} = require('../controllers/subscription');

router.get('/', async function (req, res, next) {
  try {
    res.json(await getSubscription(req.query.page));
  } catch (err) {
    next(err);
  }
});

router.get('/userSubscription',getUserSubscription);

router.get('/subbyusername/:user_name', async function (req, res, next) {
  try {
    res.json(await getSubscriptionbyUserName(req.params.user_name));
  } catch (err) {
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    res.json(await createSubscription(req.body));
  } catch (err) {
    next(err);
  }
});

router.post('/creategroupusersub', async function (req, res, next) {
  try {
    res.json(await createSubscriptionforAccountandGroup(req.body));
  } catch (err) {
    next(err);
  }
});
router.post('/creategroupsub', async function (req, res, next) {
  try {
    res.json(await createSubscriptionforGroup(req.body));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    res.json(await updateSubscription(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
});

module.exports = router;