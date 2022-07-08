const express = require('express');
const router = express.Router();
const { getAllUser,getInfo } = require('../controllers/keycloak.controller.js');

router.get('/', getAllUser);
router.get('/info', getInfo);

module.exports = router;