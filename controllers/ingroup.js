const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getIn_group(page = 1) {
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("select id,user_group_id,user_account_id,time_added,time_removed,group_admin from dpzconf.in_group", [offset, config.rowsPerPage]);
        const meta = { page };
        return {
            data,
            meta
        }
    });
}

async function createIn_group(body) {
    return db.tx(async t => {
        const data = await t.one(`INSERT INTO dpzconf.in_group(user_group_id,user_account_id,time_added,time_removed,group_admin )
        select user_group_id,user_account_id,time_added,time_removed,group_admin
        from ( select $1 user_group_id, $2 user_account_id, TO_TIMESTAMP($3,'DD-MM-YYYY HH24.MI.SS') time_added, TO_TIMESTAMP($4,'DD-MM-YYYY HH24.MI.SS') time_removed, $5 group_admin ) a
        where not exists (select 1 from  dpzconf.in_group b where a.user_group_id=b.user_group_id and a.user_account_id=b.user_account_id) RETURNING id`, [body.user_group_id, body.user_account_id, body.time_added, body.time_removed, body.group_admin]);
        return {
            data
        }
    });
}



async function deleteInGroup(req, res) {
    
    let { user_group_id, user_account_id } = req.body
    console.log(req.body)
    db.task(async t => {
        const prod = await t.one("delete from dpzconf.in_group where user_group_id = $1 and user_account_id = $2 RETURNING id", [user_group_id, user_account_id]);
        return {
            prod
        }
    })
    .then(data => {
        return res.status(200).json({
            data: data,
            message: 'delete data successfully!'
        })
    })
    .catch(error => {
        return res.status(200).json({
            message: error
        })
    });
}


async function updateIn_group(id, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE dpzconf.in_group SET user_group_id=$1,user_account_id=$2" + " WHERE id=$3 RETURNING id", [body.user_group_id, body.user_account_id, id]);

        return {
            data
        }
    });
}


module.exports = {
    getIn_group,
    createIn_group,
    updateIn_group,
    deleteInGroup
}