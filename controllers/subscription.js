const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getSubscription(page = 1) {
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("select id,user_group_id,trial_period_start_date,trial_period_end_date,subscribe_after_trial,current_plan_id,offer_id,offer_start_date,offer_end_date,date_subscribed,valid_to,date_unsubscribed,insert_ts from dpzconf.subscription", [offset, config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function getSubscriptionbyUserName(user_name){
    return db.task(async t => {
        const data = await t.any("SELECT d.user_name, a.id subscription_id, a.user_group_id FROM dpzconf.subscription a JOIN dpzconf.user_group b on (a.user_group_id=b.id) JOIN dpzconf.in_group c on (c.user_group_id = b.id) JOIN dpzconf.user_account d on (d.id = c.user_account_id) WHERE a.date_unsubscribed is null and d.user_name=$1", [user_name]);
        return {
            data,
        }
    });
}

async function createSubscription(body) {
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.subscription(user_group_id,trial_period_start_date,trial_period_end_date,subscribe_after_trial,current_plan_id,offer_id,offer_start_date,offer_end_date,date_subscribed,valid_to,date_unsubscribed,insert_ts)" + 
        "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id", [body.user_group_id,body.trial_period_start_date,body.trial_period_end_date,body.subscribe_after_trial,body.current_plan_id,body.offer_id,body.offer_start_date,body.offer_end_date,body.date_subscribed,body.valid_to,body.date_unsubsciribed,body.insert_ts,body.requestsub_id]);
        return {
            prod
        }
    });
}


async function updateSubscription(id, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.subscription SET user_group_id=$1,trial_period_start_date=$2" + " WHERE id=$3 RETURNING id", [body.user_group_id, body.trial_period_start_date, id]);
        
        return {
            data
        }
    });
}


module.exports = {
    getSubscription,
    getSubscriptionbyUserName,
    createSubscription,
    updateSubscription
    
}