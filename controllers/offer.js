const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getOffer(page = 1){
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("SELECT id, offer_name, offer_start_date, offer_end_date, description, discount_amount, discount_percentage, duration_months, duration_end_date FROM dpzconf.offer", [offset,config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function postOffer(body){
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.offer(offer_name, offer_start_date, offer_end_date, description, discount_amount, discount_percentage, duration_months, duration_end_date)" + 
        "VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id", [body.offer_name, body.offer_start_date, body.offer_end_date, body.description, body.discount_amount, body.discount_percentage, body.duration_months, body.duration_end_date]);
        return {
            prod
        }
    });
}

async function putOffer(id,body){
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.offer SET description=$1, discount_amount=$2, discount_percentage=$3" + 
        "WHERE id=$4 RETURNING id", [body.description, body.discount_amount, body.discount_percentage,id]);
        return {
            data
        }
    });
}

module.exports = {
    getOffer,
    postOffer,
    putOffer
}