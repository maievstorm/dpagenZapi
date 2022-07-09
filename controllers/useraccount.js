const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getUserAccount(page = 1){
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("SELECT id, first_name, last_name, user_name, password, email, confirmation_code, confirmation_time, insert_ts FROM dpzconf.user_account",[offset,config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function getUserNamebySubscription(id){
    return db.task(async t => {
        const data = await t.any("SELECT a.user_name, d.id subscription_id, d.user_group_id, d.trial_period_start_date, d.trial_period_end_date, d.subscribe_after_trial, d.current_plan_id, d.offer_id, d.offer_start_date, d.offer_end_date, d.date_subscribed, d.valid_to, d.date_unsubscribed, d.insert_ts FROM dpzconf.user_account a JOIN dpzconf.in_group b ON (b.user_account_id=a.id) JOIN dpzconf.user_group c ON (c.id=b.user_group_id) JOIN dpzconf.subscription d ON (d.user_group_id=c.id) WHERE d.id = $1",[id]);
        return {
            data
        }
    })
}

async function getUserAccountInfo(username){
    return db.task(async t => {
        const data = await t.one("SELECT id, first_name, last_name, user_name, password, email, confirmation_code, confirmation_time, insert_ts FROM dpzconf.user_account WHERE user_name = $1",[username]);
        return {
            data
        }
    })
}

async function postUserAccount(body){
    return db.tx(async t => {
        const data = await t.one("INSERT INTO dpzconf.user_account(first_name, last_name, user_name, password, email, confirmation_code, confirmation_time, insert_ts)" + "VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id", [body.first_name, body.last_name, body.user_name, body.password, body.email, body.confirmation_code, body.confirmation_time, body.insert_ts]);
        return {
            data
        }
    });
}

async function putUserAccount(id, body){
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.user_account SET first_name=$1, last_name=$2, user_name=$3, password=$4, email=$5, confirmation_code=$6, confirmation_time=$7, insert_ts=$8" + 
        "WHERE id=$9 RETURNING id", [body.first_name, body.last_name, body.user_name, body.password, body.email, body.confirmation_code, body.confirmation_time, body.insert_ts, id]);
        return {
            data
        }
    });
}

module.exports = {
    getUserAccount,
    getUserNamebySubscription,
    postUserAccount,
    putUserAccount,
    getUserAccountInfo
}