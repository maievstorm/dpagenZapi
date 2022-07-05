const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getPrerequisite(page = 1) {
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("select id,offer_id,plan_id from dpzconf.prerequisite", [offset, config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function getPrerequisitebyOfferandPlan(page = 1){
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const pre = await t.any("SELECT a.offer_id, a.plan_id, b.plan_name, b.software_id, b.user_group_type_id, b.current_price, b.insert_ts, b.is_active, c.offer_name, c.offer_start_date, c.offer_end_date, c.description, c.discount_amount, c.discount_percentage, c.duration_months, c.duration_end_date FROM dpzconf.prerequisite a JOIN dpzconf.plan b ON (b.id = a.plan_id) JOIN dpzconf.offer c ON (c.id = a.offer_id)", [offset, config.rowsPerPage]);
        const meta = {page};
        return{
            pre,
            meta
        }
    })
}

async function createPrerequisite(body) {
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.prerequisite(offer_id,plan_id)" + 
        "VALUES($1, $2) RETURNING id", [body.offer_id,body.plan_id]);
        return {
            prod
        }
    });
}


async function updatePrerequisite(id, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.prerequisite SET offer_id=$1,plan_id=$2" + " WHERE id=$3 RETURNING id", [body.offer_id, body.plan_id, id]);
        
        return {
            data
        }
    });
}


module.exports = {
    getPrerequisite,
    createPrerequisite,
    updatePrerequisite,
    getPrerequisitebyOfferandPlan
    
}