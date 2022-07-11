const express = require('express');
const router = express.Router();
const {getUserGroupType,postUserGroupType,putUserGroupType} = require('../controllers/usergrouptype');

router.get('/', async function (req,res,next){
    try {
        res.json(await getUserGroupType(req.query.page));
    } catch (err) {
        next(err);
    }
});

router.post('/', async function (req,res,next){
    try{
        res.json(await postUserGroupType(req.body));
    } catch(err) {
        next(err);
    }
});

router.put('/:id', async function (req,res,next){
    try{
        res.json(await putUserGroupType(req.params.id, req.body));
    } catch(err) {
        next(err);
    }
});

module.exports = router;