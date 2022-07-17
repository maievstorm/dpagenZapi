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
        const invoice = await t.one("INSERT INTO dpzconf.invoice(item_name,item_type,customer_invoice_data, subscription_id, plan_history_id, invoice_period_start_date, invoice_period_end_date, invoice_description, invoice_amount, invoice_created_ts, invoice_due_ts, invoice_paid_ts) " +
            "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id", [body.item_name,body.item_type,body.customer_invoice_data, body.subscription_id, body.plan_history_id, body.invoice_period_start_date, body.invoice_period_end_date, body.invoice_description, body.invoice_amount, body.invoice_created_ts, body.invoice_due_ts, body.invoice_paid_ts]);
        return {
            invoice
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
        const data = await t.any("SELECT id,item_name,item_type, customer_invoice_data, subscription_id, plan_history_id, invoice_period_start_date,invoice_period_end_date, invoice_description, invoice_amount, invoice_created_ts, invoice_due_ts,  invoice_paid_ts FROM dpzconf.invoice WHERE subscription_id = $1", [subscription_id]);
        return {
            data
        }
    });
}

async function getInvoiceBysubntype(subscription_id,item_type) {
    return db.task(async t => {
        const data = await t.any("SELECT id,item_name,item_type, customer_invoice_data, subscription_id, plan_history_id, invoice_period_start_date,invoice_period_end_date, invoice_description, invoice_amount, invoice_created_ts, invoice_due_ts,  invoice_paid_ts FROM dpzconf.invoice WHERE subscription_id = $1 and item_type = $2", [subscription_id,item_type]);
        return {
            data
        }
    });
}


async function updateInvoice(id, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.invoice SET customer_invoice_data=$2, invoice_description=$3 " +
        " WHERE id=$1 RETURNING id", [id,body.customer_invoice_data, body.invoice_description]);
        
        return {
            data
        }
    });
}

async function updateInvoicebuyitemname(item_name, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.invoice SET customer_invoice_data=$2, invoice_description=$3,invoice_due_ts=now() " +
        " WHERE item_name=$1 RETURNING id", [item_name,body.customer_invoice_data, body.invoice_description]);
        
        return {
            data
        }
    });
}


async function getInvoiceByusernamentype(username,item_type) {
    return db.task(async t => {
        const data = await t.any("select e.user_name,a.id id_invoice,b.id subscription_id, a.customer_invoice_data, a.subscription_id, a.plan_history_id, a.invoice_period_start_date, a.invoice_period_end_date, a.invoice_description, a.invoice_amount, a.invoice_created_ts, a.invoice_due_ts, a.invoice_paid_ts, a.item_name, a.item_type from dpzconf.invoice a join dpzconf.subscription b on (a.subscription_id=b.id) join dpzconf.user_group c on (c.id=b.user_group_id) join dpzconf.in_group d on  (c.id=d.user_group_id) join dpzconf.user_account e on (d.user_account_id=e.id) where e.user_name= $1 and a.item_type= $2", [username,item_type]);
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
    getInvoiceBysubntype,
    getInvoiceByusernamentype,
    updateInvoice,
	updateInvoicebuyitemname
    
}
