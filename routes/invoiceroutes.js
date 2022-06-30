const express = require('express');
const router = express.Router();
const { getInvoice, createInvoice,getInvoiceByItem,getInvoiceBysub,getInvoiceBysubntype,getInvoiceByusernamentype,updateInvoice,updateInvoicebuyitemname } = require('../controllers/invoice');

/* GET invoice list */
router.get('/', async function(req, res, next) {
  try {
    res.json(await getInvoice(req.query.page));
  } catch (err) {
    next(err);
  }
});


/* POST invoice */
router.post('/', async function(req, res, next) {
  try {
    res.json(await createInvoice(req.body));
  } catch (err) {
    next(err);
  }
});

/* GET invoice by item_name */
router.get('/:item_name', async function(req, res, next) {
  try {
    res.json(await getInvoiceByItem(req.params.item_name));
  } catch (err) {
    next(err);
  }
});

/* GET invoice by subscription */
router.get('/subscription/:subscription_id', async function(req, res, next) {
  try {
    res.json(await getInvoiceBysub(req.params.subscription_id));
  } catch (err) {
    next(err);
  }
});

/* GET invoice by subscription and itemtype */
router.get('/subntype/:subscription_id&:item_type', async function(req, res, next) {
  try {
    res.json(await getInvoiceBysubntype(req.params.subscription_id,req.params.item_type));
  } catch (err) {
    next(err);
  }
});

/* GET invoice by username and itemtype */
router.get('/usernamentype/:user_name&:item_type', async function(req, res, next) {
  try {
    res.json(await getInvoiceByusernamentype(req.params.user_name,req.params.item_type));
  } catch (err) {
    next(err);
  }
});

/* UPDATE invoice */
router.put('/:id', async function(req, res, next) {
  try {
    res.json(await updateInvoice(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
});

/* UPDATE invoice by item_name */
router.put('/itemname/:item_name', async function(req, res, next) {
  try {
    res.json(await updateInvoicebuyitemname(req.params.item_name, req.body));
  } catch (err) {
    next(err);
  }
});



module.exports = router;