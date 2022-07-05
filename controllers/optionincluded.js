const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getOptionIncluded(page = 1){
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("SELECT id, plan_id, option_id, date_added, date_removed FROM dpzconf.option_included", [offset,config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function postOptionIncluded(body){
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.option_included(plan_id, option_id, date_added, date_removed)" + "VALUES($1, $2, $3, $4) RETURNING id", [body.plan_id, body.option_id, body.date_added, body.date_removed]);
        return {
            prod
        }
    });
}

async function putOptionIncluded(id,body){
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.option_included SET plan_id=$1, option_id=$2, date_added=$3, date_removed=$4" + 
        "WHERE id=$5 RETURNING id",[body.plan_id,body.option_id,body.date_added,body.date_removed,id]);
        return {
            data
        }
    });
}

module.exports = {
    getOptionIncluded,
    postOptionIncluded,
    putOptionIncluded
}