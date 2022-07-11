const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getPlan_history(page = 1) {
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("select id,subscription_id,plan_id,date_start,date_end,insert_ts from dpzconf.plan_history", [offset, config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function createPlan_history(body) {
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.plan_history(subscription_id,plan_id,date_start,date_end,insert_ts)" + 
        "VALUES($1, $2, $3, $4, $5) RETURNING id", [body.subscription_id,body.plan_id,body.date_start,body.date_end,body.insert_ts]);
        return {
            prod
        }
    });
}


async function updatePlan_history(id, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.plan_history SET subscription_id=$1,plan_id=$2,date_start=$3,date_end=$4,insert_ts=$5" + " WHERE id=$6 RETURNING id", [body.subscription_id, body.plan_id, body.date_start, body.date_end, body.insert_ts, id]);
        
        return {
            data
        }
    });
}


module.exports = {
    getPlan_history,
    createPlan_history,
    updatePlan_history
    
}