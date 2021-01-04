'use strict';

module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            database: 'address_book_development',
            user:     'address_book_development'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    test: {
        client: 'postgresql',
        connection: {
            database: 'address_book_test',
            user:     'address_book_test'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    staging: {
        client: 'postgresql',
        connection: {
            database: 'address_book_staging',
            user:     'address_book_staging',
            password: ''
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    production: {
        client: 'postgresql',
        connection: {
            database: 'address_book',
            user:     'address_book',
            password: ''
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
