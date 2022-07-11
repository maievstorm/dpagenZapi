const express = require('express');
const router = express.Router();
const {getPlan,createPlan,updatePlan} = require('../controllers/plan');

router.get('/', async function(req, res, next) {
    try {
      res.json(await getPlan(req.query.page));
    } catch (err) {
      next(err);
    }
  });
  

router.post('/', async function(req, res, next) {
    try {
      res.json(await createPlan(req.body));
    } catch (err) {
      next(err);
    }
  });



router.put('/:id', async function(req, res, next) {
    try {
      res.json(await updatePlan(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  });
  
module.exports = router;