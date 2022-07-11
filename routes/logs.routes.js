const express = require('express');
const router = express.Router();
const { addLog,searchLogs} = require('../controllers/logs.controller.js');

router.post('/addLog', addLog);
router.get('/search', searchLogs);
module.exports = router;