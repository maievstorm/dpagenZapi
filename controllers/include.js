const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getInclude(page = 1) {
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("SELECT id, offer_id, plan_id FROM dpzconf.include",[offset,config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function postInclude(body){
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.include(offer_id,plan_id)" + "VALUES($1, $2) RETURNING id", [body.offer_id, body.plan_id]);
        return {
            prod
        }
    });
}

async function putInclude(id, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.include SET offer_id=$1, plan_id=$2 " +
        " WHERE id=$3 RETURNING id", [body.offer_id, body.plan_id, id]);
        return {
            data
        }
    });
}


module.exports = {
    getInclude,
    postInclude,
    putInclude
}