const express = require('express');
const router = express.Router();
const {getInclude, postInclude, putInclude} = require('../controllers/include');

router.get('/', async function (req,res,next){
    try {
        res.json(await getInclude(req.query.page));
    } catch (err) {
        next(err);
    }
});

router.post('/', async function (req,res,next){
    try {
        res.json(await postInclude(req.body));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async function(req, res, next) {
    try {
      res.json(await putInclude(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  });

module.exports = router;