'use strict';

module.exports = {
    up: async knex => {
        await knex.schema.createTable('contacts', tbl => {
            tbl.increments('id');
            tbl.string('first_name').notNullable();
            tbl.string('last_name').notNullable();
            tbl.string('email').notNullable();
            tbl.timestamps(true, true);

            tbl.unique('email');
            tbl.index('last_name');
        });
    },
    down: async knex => {
        await knex.schema.dropTable('contacts');
    }
};
