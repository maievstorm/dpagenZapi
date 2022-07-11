const express = require('express');
const router = express.Router();
const {getPlan_history,createPlan_history,updatePlan_history} = require('../controllers/planhistory');


router.get('/', async function(req, res, next) {
    try {
      res.json(await getPlan_history(req.query.page));
    } catch (err) {
      next(err);
    }
  });
  

router.post('/', async function(req, res, next) {
    try {
      res.json(await createPlan_history(req.body));
    } catch (err) {
      next(err);
    }
  });



router.put('/:id', async function(req, res, next) {
    try {
      res.json(await updatePlan_history(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  });
  
module.exports = router;