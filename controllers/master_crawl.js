const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);

async function getMasterCrawl(page = 1){
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const mastercrawl = await t.any("SELECT crawl_master_id, crawl_type, crawl_home, crawl_home_url, home_name, status, last_crawl_date, description, crawl_user, crawl_password, config_folder, crawl_days_before, err_mess, create_user, created, update_user, updated FROM public.master_crawl",[offset, config.rowsPerPage]);
        const meta = {page}
        return {
            mastercrawl,
            meta
        }
    });
}

async function postMasterCrawl(body){
    return db.tx(async t => {
        const prod = await t.one("INSERT INTO public.master_crawl(crawl_type, crawl_home, crawl_home_url, home_name, status, last_crawl_date, description, crawl_user, crawl_password, config_folder, crawl_days_before, err_mess, create_user, created, update_user, updated)" + "VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING crawl_master_id", [body.crawl_type,body.crawl_home,body.crawl_home_url,body.home_name,body.status,body.last_crawl_date,body.description,body.crawl_user,body.crawl_password,body.config_folder,body.crawl_days_before,body.err_mess,body.create_user,body.created,body.update_user,body.updated]);
        return {
            prod
        }
    });
}

async function putMasterCrawl(id, body) {
    return db.task(async t => {
        const data = await t.one("UPDATE public.master_crawl SET crawl_type=$1, crawl_home=$2, crawl_home_url=$3, home_name=$4, status=$5, last_crawl_date=$6, description=$7, crawl_user=$8, crawl_password=$9, config_folder=$10, crawl_days_before=$11, err_mess=$12, create_user=$13, created=$14, update_user=$15, updated=$16 " +
        " WHERE crawl_master_id=$17 RETURNING crawl_master_id", [body.crawl_type,body.crawl_home,body.crawl_home_url,body.home_name,body.status,body.last_crawl_date,body.description,body.crawl_user,body.crawl_password,body.config_folder,body.crawl_days_before,body.err_mess,body.create_user,body.created,body.update_user,body.updated,id]);
        return {
            data
        }
    });
}

module.exports = {
    getMasterCrawl,
    postMasterCrawl,
    putMasterCrawl
}