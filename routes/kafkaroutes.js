const express = require('express');
const router = express.Router();
const { getKafkaConnectorsall,
    getKafkaConnector,
    getKafkaConnectorStatus,
    pauseKafkaConnector,
    restartKafkaConnector,
    createKafkaConnector } = require('../controllers/kafkapi.js');

router.get('/', getKafkaConnectorsall);
router.get('/connector', getKafkaConnector);
router.get('/connectorstatus', getKafkaConnectorStatus);
router.put('/pauseconnector', pauseKafkaConnector);
router.post('/restartconnector', restartKafkaConnector);
router.post('/createkafkaconnector', createKafkaConnector);

module.exports = router;