const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getOption(page = 1){
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("SELECT id, option_name FROM dpzconf.option", [offset,config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function postOption(body){
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.option(option_name) " + "VALUES ($1) RETURNING id", [body.option_name]);
        return {
            prod
        }
    });
}

async function putOption(id,body){
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.option SET option_name=$1" + 
        "WHERE id=$2 RETURNING id",[body.option_name,id]);
        return {
            data
        }
    });
}

module.exports = {
    getOption,
    postOption,
    putOption
}