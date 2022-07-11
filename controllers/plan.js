const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getPlan(page = 1) {
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("select id,plan_name,software_id,user_group_type_id,current_price,insert_ts,is_active from dpzconf.plan", [offset, config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function createPlan(body) {
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.plan(plan_name,software_id,user_group_type_id,current_price,insert_ts,is_active)" + 
        "VALUES($1, $2, $3, $4, $5, $6) RETURNING id", [body.plan_name,body.software_id,body.user_group_type_id,body.current_price,body.insert_ts,body.is_active]);
        return {
            prod
        }
    });
}


async function updatePlan(id, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.plan SET software_id=$1,user_group_type_id=$2" + " WHERE id=$3 RETURNING id", [body.software_id, body.user_group_type_id, id]);
        
        return {
            data
        }
    });
}


module.exports = {
    getPlan,
    createPlan,
    updatePlan
    
}