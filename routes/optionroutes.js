const express = require('express');
const router = express.Router();
const {getOption,postOption,putOption} = require("../controllers/option");

router.get('/', async function (req,res,next){
    try {
        res.json(await getOption(req.query.page));
    } catch (err) {
        next(err);
    }
});

router.post('/', async function (req,res,next){
    try {
        res.json(await postOption(req.body));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async function (req,res,next){
    try{
        res.json(await putOption(req.params.id, req.body))
    } catch (err) {
        next(err);
    }
})

module.exports = router;