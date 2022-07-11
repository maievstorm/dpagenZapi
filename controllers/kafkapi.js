const axios = require('axios').default;

async function getKafkaConnectorsall(req, res) {
  axios({
    method: 'get',
    url: 'http://kafkadpa-headless:8083/connectors'
  })
    .then(data => {
      return res.status(200).json({
        data: data.data
      })
    })
}

async function getKafkaConnector(req, res) {
  let connector = req.query.connector
  axios({
    method: 'get',
    url: `http://kafkadpa-headless:8083/connectors/${connector}`
  })
    .then(data => {
      return res.status(200).json({
        data: data.data
      })
    })
}


async function getKafkaConnectorStatus(req, res) {
  let connector = req.query.connector
  axios({
    method: 'get',
    url: `http://kafkadpa-headless:8083/connectors/${connector}/status`
  })
    .then(data => {
      return res.status(200).json({
        data: data.data
      })
    })
}


async function pauseKafkaConnector(req, res) {
  let connector = req.query.connector
  axios({
    method: 'put',
    url: `http://kafkadpa-headless:8083/connectors/${connector}/pause`
  })
    .then(data => {
      return res.status(200).json({
        data: data.data
      })
    })
}

async function restartKafkaConnector(req, res) {
  let connector = req.query.connector
  axios({
    method: 'POST',
    url: `http://kafkadpa-headless:8083/connectors/${connector}/restart`
  })
    .then(data => {
      return res.status(200).json({
        data: data.data
      })
    })
}


async function createKafkaConnector(req, res) {
  let data = req.body
  axios({
    method: 'POST',
    url: 'http://kafkadpa-headless:8083/connectors',
    data: data,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(data => {
      return res.status(200).json({
        data: data.data
      })
    }).catch(e=> {console.log(e) 
      return res.status(200).json({
        message: e
      })})
}





module.exports = {
  getKafkaConnectorsall,
  getKafkaConnector,
  getKafkaConnectorStatus,
  pauseKafkaConnector,
  restartKafkaConnector,
  createKafkaConnector
}