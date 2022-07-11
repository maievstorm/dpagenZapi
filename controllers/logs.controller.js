const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function addLog(req, res) {
    let { username, action, detail } = req.body
    let created = new Date()
    try {
        await db.none('INSERT INTO dpzconf.logs(username, created,action, detail) VALUES($/username/, $/created/, $/action/,$/detail/)', {
            username: username,
            created: created,
            action: action,
            detail: detail,
        })
        .then(()=>{
            return res.status(200).json({
                message:'add log successfully!'
            })

        })
        .catch(err=>{
            return res.status(200).json({
                message: err.message
            })

        })

    } catch (error) {
        return res.status(200).json({
            message: 'error add log!'
        })

    }
}

async function searchLogs(req, res) {
    let username = req.query.username
    let action = req.query.action

    console.log('action',action)
    try {
        if (action !== undefined && action !== ''){
            await db.any('select *from dpzconf.logs where username = $1 and action = $2',[username,action])
            .then(data=>{
                return res.status(200).json({
                    message:'query successfully!',
                    data:data
                })
    
            })
            .catch(err=>{
                return res.status(200).json({
                    message: err.message
                })
    
            })
        }
        else if(username !== undefined && username !== ''){
            await db.any('select *from dpzconf.logs where username = $1',username)
            .then(data=>{
                return res.status(200).json({
                    message:'query successfully!',
                    data:data
                })
    
            })
            .catch(err=>{
                return res.status(200).json({
                    message: err.message
                })
    
            })
        }
        else{
            await db.any('select *from dpzconf.logs')
            .then(data=>{
                return res.status(200).json({
                    message:'query all successfully!',
                    data:data
                })
    
            })
            .catch(err=>{
                return res.status(200).json({
                    message: err.message
                })
    
            })

        }

    } catch (error) {
        return res.status(200).json({
            message: err.message
        })

    }
}


module.exports = {
    addLog,
    searchLogs
}
