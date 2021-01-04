'use strict';

const { knex } = require('../../lib/db');

module.exports = {
    cleanDb: async () => {
        await knex('contacts').del();
    }
};
