'use strict';

module.exports = {
    development: {
        client: 'pg',
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
        client: 'pg',
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
        client: 'pg',
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
        client: 'pg',
        connection: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
