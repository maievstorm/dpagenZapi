const express = require('express');
const router = express.Router();
const {getSoftware,createSoftware,updateSoftware} = require('../controllers/software');

router.get('/', async function(req, res, next) {
    try {
      res.json(await getSoftware(req.query.page));
    } catch (err) {
      next(err);
    }
  });
  

router.post('/', async function(req, res, next) {
    try {
      res.json(await createSoftware(req.body));
    } catch (err) {
      next(err);
    }
  });



router.put('/:id', async function(req, res, next) {
    try {
      res.json(await updateSoftware(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  });
  
module.exports = router;