const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getUserGroup(page = 1){
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("SELECT id, user_group_type_id, customer_invoice_data, insert_ts FROM dpzconf.user_group",[offset,config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function postUserGroup(body){
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.user_group(user_group_type_id, customer_invoice_data, insert_ts)" + "VALUES($1, $2, $3) RETURNING id", [body.user_group_type_id, body.customer_invoice_data, body.insert_ts]);
        return {
            prod
        }
    });
}

async function putUserGroup(id, body){
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.user_group SET user_group_type_id=$1, customer_invoice_data=$2, insert_ts=$3" + 
        "WHERE id=$4 RETURNING id", [body.user_group_type_id, body.customer_invoice_data, body.insert_ts, id]);
        return {
            data
        }
    });
}

module.exports = {
    getUserGroup,
    postUserGroup,
    putUserGroup
}