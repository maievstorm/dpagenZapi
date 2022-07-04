const express = require('express');
const router = express.Router();
const {getOffer,putOffer,postOffer} = require("../controllers/offer");

router.get('/', async function (req,res,next){
    try {
        res.json(await getOffer(req.query.page));
    } catch (err) {
        next(err);
    }
});

router.post('/', async function (req,res,next){
    try{
        res.json(await postOffer(req.body));
    } catch(err) {
        next(err);
    }
});

router.put('/:id', async function (req,res,next){
    try{
        res.json(await putOffer(req.params.id, req.body));
    } catch(err) {
        next(err);
    }
});

module.exports = router;