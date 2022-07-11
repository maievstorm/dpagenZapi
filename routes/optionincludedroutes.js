const express = require('express');
const router = express.Router();
const {getOptionIncluded, postOptionIncluded, putOptionIncluded} = require('../controllers/optionincluded');

router.get('/', async function (req,res,next){
    try {
        res.json(await getOptionIncluded(req.query.page));
    } catch (err) {
        next(err);
    }
});

router.post('/', async function (req,res,next){
    try {
        res.json(await postOptionIncluded(req.body));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async function (req,res,next){
    try{
        res.json(await putOptionIncluded(req.params.id, req.body))
    } catch (err) {
        next(err);
    }
})

module.exports = router;

