const promise = require('bluebird');
const initOptions = {
    promiseLib: promise // overriding the default (ES6 Promise);
};
const pgp = require('pg-promise')(initOptions);
const config = require('../config');
const db = pgp(config.db);




async function getChecksong(page = 1) {
    const offset = (page - 1) * [config.rowsPerPage];
    return db.task(async t => {
        const data = await t.any("select a.id,a.check_song_name,b.url src_url,b.tags src_tags,b.duration src_song_duration, b.view_count src_view_count,a.original_song_name,c.duration tar_song_duration,a.time_similar,a.accuracy_similar,a.fingerprint_match,a.start_match_target,a.start_match_source from public.check_song a join public.detail_crawl b on a.check_song_id=b.id join public.detail_crawl c on a.original_song_id=c.id", [offset, config.rowsPerPage]);
        const meta = {page};
        return {
            data,
            meta
        }
    });
}

module.exports = {
    getChecksong
}