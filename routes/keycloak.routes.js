const express = require('express');
const router = express.Router();
const { addUser,getInfo ,changePassword} = require('../controllers/keycloak.controller.js');

router.post('/addUser', addUser);
router.get('/info', getInfo);

router.post('/changePassword', changePassword);

module.exports = router;