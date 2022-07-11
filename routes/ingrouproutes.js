const express = require('express');
const router = express.Router();
const {getIn_group,createIn_group,updateIn_group} = require('../controllers/ingroup');

router.get('/', async function(req, res, next) {
    try {
      res.json(await getIn_group(req.query.page));
    } catch (err) {
      next(err);
    }
  });
  

router.post('/', async function(req, res, next) {
    try {
      res.json(await createIn_group(req.body));
    } catch (err) {
      next(err);
    }
  });


router.put('/:id', async function(req, res, next) {
    try {
      res.json(await updateIn_group(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  });
  
module.exports = router;