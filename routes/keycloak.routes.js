const express = require('express');
const router = express.Router();
const { addUser,getInfo ,changePassword,getUserInfo} = require('../controllers/keycloak.controller.js');

router.post('/addUser', addUser);
router.get('/info', getInfo);
router.post('/userInfo', getUserInfo);


router.put('/changePassword', changePassword);

module.exports = router;