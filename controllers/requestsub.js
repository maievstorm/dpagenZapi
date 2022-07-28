const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getRequestsub(page = 1) {
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("SELECT id, user_account_id, user_name, fullname, email, upassword, offer_id, plan_id, request_date, request_status,request_type FROM dpzconf.requestsub", [offset, config.rowsPerPage]);
        const meta = { page };
        return {
            data,
            meta
        }
    });
}

async function getRequestsubbyUserName(user_name) {
    return db.task(async t => {
        const data = await t.any("SELECT id, user_account_id, user_name, fullname, email, upassword, offer_id, plan_id, request_date, request_status,request_type FROM dpzconf.requestsub WHERE  user_name=$1", [user_name]);
        return {
            data,
        }
    });
}

async function createRequestsub(body) {
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.requestsub(user_account_id, user_name, fullname, email, upassword, offer_id, plan_id, request_date, request_status,request_type)" +
            "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) RETURNING id", [body.user_account_id, body.user_name, body.fullname, body.email, body.upassword, body.offer_id, body.plan_id, body.request_date, body.request_status, body.request_type]);
        return {
            prod
        }
    });
}


async function updateRequestsub(id, body) {
    console.log(id)
    console.log(body.request_status)
    return db.task(async t => {
        const data = await t.one("update dpzconf.requestsub set request_status=$2 ,approve_user=$3,approve_dt=now()" + " WHERE id=$1 RETURNING id", [id, body.request_status, body.approve_user]);

        return {
            data
        }
    });
}

async function updateRequestType(req, res) {
    let id = req.body.id
    let request_type = req.body.request_type


    return db.task(async t => {
        const data = await t.one("update dpzconf.requestsub set request_type=$2" + " WHERE id=$1 RETURNING id", [id, request_type]);

        return {
            data
        }
    });
}

async function getResourceusageUserName(user_name) {
    return db.task(async t => {
        const data = await t.any("SELECT id, username, subscription_id, item_type, useage, price, rpt_dt, rpt_year, rpt_month FROM dpzconf.resourceusage WHERE  username=$1", [user_name]);
        return {
            data,
        }
    });
}

async function aggregateResource(req, res) {
    let userName = req.query.userName

    console.log(userName)

    try {
        const data = await db.any("SELECT username, item_type, rpt_dt, rpt_year, rpt_month, price_total_year, price_total_month, useage, price FROM dpzconf.user_resource WHERE username=$1", [userName]);

        console.log(data)
        return res.status(200).json({
            data: data,
            message: 'get data successfully!'
        })

    } catch (error) {
        return res.status(200).json({
            message: 'error!'
        })

    }


}


module.exports = {
    getRequestsub,
    getRequestsubbyUserName,
    createRequestsub,
    updateRequestsub,
    updateRequestType,
    getResourceusageUserName,
    aggregateResource

}