const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getUserGroupType(page = 1){
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("SELECT id, type_name, members_min, members_max FROM dpzconf.user_group_type",[offset,config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function postUserGroupType(body){
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.user_group_type(type_name, members_min, members_max)" + "VALUES($1, $2, $3) RETURNING id", [body.type_name, body.members_min, body.members_max]);
        return {
            prod
        }
    });
}

async function putUserGroupType(id, body){
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.user_group_type SET type_name=$1, members_min=$2, members_max=$3" + 
        "WHERE id=$4 RETURNING id", [body.type_name, body.members_min, body.members_max, id]);
        return {
            data
        }
    });
}

module.exports = {
    getUserGroupType,
    postUserGroupType,
    putUserGroupType
}