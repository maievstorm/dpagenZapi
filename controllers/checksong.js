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
        const data = await t.any("SELECT id, check_song_id, check_song_name, original_song_id, original_song_name,input_total_hashes, fingerprinted_hashes_in_db, time_similar, accuracy_similar, fingerprint_match, hashes_matched_in_input, input_confidence, fingerprinted_confidence, offset_seconds FROM public.check_song", [offset, config.rowsPerPage]);
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