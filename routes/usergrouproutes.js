const express = require('express');
const router = express.Router();
const {getUserGroup,postUserGroup, putUserGroup} = require('../controllers/usergroup');

router.get('/', async function (req,res,next){
    try {
        res.json(await getUserGroup(req.query.page));
    } catch (err) {
        next(err);
    }
});

router.post('/', async function (req,res,next){
    try{
        res.json(await postUserGroup(req.body));
    } catch(err) {
        next(err);
    }
});

router.put('/:id', async function (req,res,next){
    try{
        res.json(await putUserGroup(req.params.id, req.body));
    } catch(err) {
        next(err);
    }
});

module.exports = router;