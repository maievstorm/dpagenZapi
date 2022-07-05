const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getSoftware(page = 1) {
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("select id,software_name,details,access_link from dpzconf.software", [offset, config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

async function createSoftware(body) {
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO dpzconf.software(software_name,details,access_link)" + 
        "VALUES($1, $2, $3) RETURNING id", [body.software_name,body.details,body.access_link]);
        return {
            prod
        }
    });
}


async function updateSoftware(id, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.software SET software_name=$1,details=$2" + " WHERE id=$3 RETURNING id", [body.software_name, body.details, id]);
        
        return {
            data
        }
    });
}


module.exports = {
    getSoftware,
    createSoftware,
    updateSoftware
    
}