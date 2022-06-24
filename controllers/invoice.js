const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getInvoice(page = 1) {
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("SELECT id,item_name, customer_invoice_data, subscription_id, plan_history_id, invoice_period_start_date, invoice_period_end_date, invoice_description, invoice_amount, invoice_created_ts, invoice_due_ts, invoice_paid_ts FROM dpzconf.invoice", [offset, config.rowsPerPage]);
        const meta = { page };
        return {
            data,
            meta
        }
    });
}


async function createInvoice(body) {
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.invoice(item_name,item_type,customer_invoice_data, subscription_id, plan_history_id, invoice_period_start_date, invoice_period_end_date, invoice_description, invoice_amount, invoice_created_ts, invoice_due_ts, invoice_paid_ts) " +
            "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id", [body.item_name,body.item_type,body.customer_invoice_data, body.subscription_id, body.plan_history_id, body.invoice_period_start_date, body.invoice_period_end_date, body.invoice_description, body.invoice_amount, body.invoice_created_ts, body.invoice_due_ts, body.invoice_paid_ts]);
        return {
            prod
        }
    });
}

async function getInvoiceByItem(item_name) {
    return db.task(async t => {
        const data = await t.one("SELECT id,item_name, customer_invoice_data, subscription_id, plan_history_id, invoice_period_start_date,invoice_period_end_date, invoice_description, invoice_amount, invoice_created_ts, invoice_due_ts,  invoice_paid_ts FROM dpzconf.invoice WHERE item_name = $1", [item_name]);
        return {
            data
        }
    });
}


async function getInvoiceBysub(subscription_id) {
    return db.task(async t => {
        const data = await t.any("SELECT id,item_name, customer_invoice_data, subscription_id, plan_history_id, invoice_period_start_date,invoice_period_end_date, invoice_description, invoice_amount, invoice_created_ts, invoice_due_ts,  invoice_paid_ts FROM dpzconf.invoice WHERE subscription_id = $1", [subscription_id]);
        return {
            data
        }
    });
}


async function updateInvoice(id, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE pzconf.invoice SET customer_invoice_data=$1, invoice_description=$2 " +
        " WHERE id=$5 RETURNING id", [body.customer_invoice_data, body.invoice_description, id]);
        
        return {
            data
        }
    });
}

module.exports = {
    getInvoice,
    createInvoice,
    getInvoiceByItem,
    getInvoiceBysub,
    updateInvoice
}