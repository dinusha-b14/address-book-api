'use strict';

const knex = require('knex');
const dbConnections = require('../knexfile');
const dbEnv = process.env.NODE_ENV || 'development';

const connector = knex(dbConnections[dbEnv]);

module.exports = {
    knex: connector
};
