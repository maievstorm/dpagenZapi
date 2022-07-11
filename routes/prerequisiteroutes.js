const express = require('express');
const router = express.Router();
const {getPrerequisite,createPrerequisite,updatePrerequisite,getPrerequisitebyOfferandPlan} = require('../controllers/prerequisite');

router.get('/', async function(req, res, next) {
    try {
      res.json(await getPrerequisite(req.query.page));
    } catch (err) {
      next(err);
    }
  });
  

router.get('/offerandplan', async function(req, res, next) {
    try {
      res.json(await getPrerequisitebyOfferandPlan(req.query.page));
    } catch (err) {
      next(err);
    }
  });


router.post('/', async function(req, res, next) {
    try {
      res.json(await createPrerequisite(req.body));
    } catch (err) {
      next(err);
    }
  });



router.put('/:id', async function(req, res, next) {
    try {
      res.json(await updatePrerequisite(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  });
  
module.exports = router;