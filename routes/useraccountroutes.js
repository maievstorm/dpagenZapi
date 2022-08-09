const express = require('express');
const router = express.Router();
const {getUserAccount,getUserNamebySubscription,postUserAccount,putUserAccount,getUserAccountInfo} = require("../controllers/useraccount");

router.get('/', async function (req,res,next){
    try {
        res.json(await getUserAccount(req.query.page));
    } catch (err) {
        next(err);
    }
});
router.get('/accountbyusername', async function (req,res,next){
    try {
        res.json(await getUserAccountInfo(req.query.username));
    } catch (err) {
        next(err);
    }
});


router.get('/usernamebysub/:id', async function (req,res,next){
    try {
        res.json(await getUserNamebySubscription(req.params.id));
    } catch (err) {
        next(err);
    }
});

router.post('/', async function (req,res,next){
    try{
        res.json(await postUserAccount(req.body));
    } catch(err) {
        next(err);
    }
});

router.put('/:id', async function (req,res,next){
    try{
        res.json(await putUserAccount(req.params.id, req.body));
    } catch(err) {
        next(err);
    }
});

module.exports = router;