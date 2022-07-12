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
        const data = await t.any("select id,user_group_id,trial_period_start_date,trial_period_end_date,subscribe_after_trial,current_plan_id,offer_id,offer_start_date,offer_end_date,date_subscribed,valid_to,date_unsubscribed,insert_ts,subscription_name from dpzconf.subscription", [offset, config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function getSubscriptionbyUserName(user_name){
    return db.task(async t => {
        const data = await t.any("SELECT d.user_name, a.id subscription_id, a.user_group_id,a.subscription_name FROM dpzconf.subscription a JOIN dpzconf.user_group b on (a.user_group_id=b.id) JOIN dpzconf.in_group c on (c.user_group_id = b.id) JOIN dpzconf.user_account d on (d.id = c.user_account_id) WHERE d.user_name=$1", [user_name]);
        return {
            data
        }
    });
}

async function createSubscription(body) {
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.subscription(user_group_id,trial_period_start_date,trial_period_end_date,subscribe_after_trial,current_plan_id,offer_id,offer_start_date,offer_end_date,date_subscribed,valid_to,date_unsubscribed,insert_ts,subscription_name)" + 
        "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13) RETURNING id", [body.user_group_id,body.trial_period_start_date,body.trial_period_end_date,body.subscribe_after_trial,body.current_plan_id,body.offer_id,body.offer_start_date,body.offer_end_date,body.date_subscribed,body.valid_to,body.date_unsubsciribed,body.insert_ts,body.subscription_name]);
        return {
            prod
        }
    });
}

async function createSubscriptionforAccountandGroup(body){
    return db.tx(async t => {
        const group = await t.one("INSERT INTO dpzconf.user_group(user_group_type_id, customer_invoice_data, insert_ts)"+
        "VALUES($1, $2, $3) RETURNING id", [body.user_group_type_id, body.customer_invoice_data, body.insert_ts]);
        const account = await t.one("INSERT INTO dpzconf.user_account(first_name, last_name, user_name, password, email, confirmation_code, confirmation_time, insert_ts)"+
        "VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id", [body.first_name,body.last_name,body.user_name,body.password,body.email,body.confirmation_code,body.confirmation_time,body.insert_ts]);
        body.ingroup.map(v => {
            return db.tx(async t2 => {
                await t2.one("INSERT INTO dpzconf.in_group(user_group_id,user_account_id,time_added,time_removed,group_admin)"+
                "VALUES ($1,$2,$3,$4,$5) RETURNING id",[group.id,account.id,v.time_added,v.time_removed,v.group_admin]);
            });
        });
        body.subscription.map(v => {
            return db.tx(async t2 => {
                await t2.one("INSERT INTO dpzconf.subscription(user_group_id, trial_period_start_date, trial_period_end_date, subscribe_after_trial, current_plan_id, offer_id, offer_start_date, offer_end_date, date_subscribed, valid_to, date_unsubscribed, insert_ts,subscription_name, requestsub_id)"+
                "VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id", [group.id,v.trial_period_start_date,v.trial_period_end_date,v.subscribe_after_trial,v.current_plan_id,v.offer_id,v.offer_start_date,v.offer_end_date,v.date_subscribed,v.valid_to,v.date_unsubscribed,v.insert_ts,v.subscription_name,v.requestsub_id]);
            });
        });        
        return{
            group,
            account
        }
    });
}

async function createSubscriptionforGroup(body){
    return db.tx(async t => {
        const group = await t.one("INSERT INTO dpzconf.user_group(user_group_type_id, customer_invoice_data, insert_ts)"+
        "VALUES($1, $2, $3) RETURNING id", [body.user_group_type_id, body.customer_invoice_data, body.insert_ts]);
        body.ingroup.map(v => {
            return db.tx(async t1 => {
                await t1.one("INSERT INTO dpzconf.in_group(user_group_id,user_account_id,time_added,time_removed,group_admin)"+
                "VALUES ($1,$2,$3,$4,$5) RETURNING id",[group.id,body.account_id,v.time_added,v.time_removed,v.group_admin]);
            });
        });
        const subscription =body.subscription.map(v => {
            return db.tx(async t1 => {
                await t1.one("INSERT INTO dpzconf.subscription(user_group_id, trial_period_start_date, trial_period_end_date, subscribe_after_trial, current_plan_id, offer_id, offer_start_date, offer_end_date, date_subscribed, valid_to, date_unsubscribed, insert_ts,subscription_name, requestsub_id)"+
                "VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)", [group.id,v.trial_period_start_date,v.trial_period_end_date,v.subscribe_after_trial,v.current_plan_id,v.offer_id,v.offer_start_date,v.offer_end_date,v.date_subscribed,v.valid_to,v.date_unsubscribed,v.insert_ts,v.subscription_name,v.requestsub_id]);
            });
        });        
        return{
            group,
            subscription            
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
    createSubscriptionforAccountandGroup,
    createSubscriptionforGroup,
    updateSubscription
    
}