const express = require('express');
const router = express.Router();
const {getMasterCrawl,postMasterCrawl,putMasterCrawl} = require('../controllers/master_crawl');

router.get('/', async function (req,res,next){
    try {
        res.json(await getMasterCrawl(req.query.page));
    } catch (err) {
        next(err);
    }
});

router.post('/', async function (req,res,next){
    try {
        res.json(await postMasterCrawl(req.body));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async function(req, res, next) {
    try {
      res.json(await putMasterCrawl(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  });

module.exports = router;