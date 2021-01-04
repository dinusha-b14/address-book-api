'use strict';

const { knex } = require('../../lib/db');

module.exports = {
    list: async (_, res) => {
        const contacts = await knex
            .select('id', 'first_name as firstName', 'last_name as lastName', 'email', 'created_at as createdAt', 'updated_at as updatedAt')
            .from('contacts');

        res.status(200).json(contacts);
    },
    show: async (req, res) => {
        const { id } = req.params;
        const [contact] = await knex
            .select('id', 'first_name as firstName', 'last_name as lastName', 'email', 'created_at as createdAt', 'updated_at as updatedAt')
            .where({ id })
            .from('contacts');

        if (!contact) {
            res.status(404).end();
        } else {
            res.status(200).json(contact);
        }
    },
    create: async (req, res) => {
        const { firstName, lastName, email } = req.body;

        const [contact] = await knex
            .select('first_name as firstName', 'last_name as lastName', 'email')
            .where({ email })
            .from('contacts');
        
        if (contact) {
            res.status(409).end();
        } else {
            const [createdContact] = await knex('contacts')
                .insert({
                    first_name: firstName,
                    last_name: lastName,
                    email
                }, [
                    'id',
                    'first_name as firstName',
                    'last_name as lastName',
                    'email',
                    'created_at as createdAt',
                    'updated_at as updatedAt'
                ]);
        
            res.status(201).json(createdContact);
        }
    },
    update: async (req, res) => {
        const { id } = req.params;
        const { firstName, lastName } = req.body;

        const [contact] = await knex.select('id').where({ id }).from('contacts');

        if (!contact) {
            res.status(404).end();
        } else {
            const [updatedContact] = await knex('contacts')
                .update({
                    first_name: firstName,
                    last_name: lastName,
                    updated_at: new Date()
                }, ['id', 'first_name as firstName', 'last_name as lastName', 'email', 'created_at as createdAt', 'updated_at as updatedAt'])
                .where({ id });

            res.status(200).json(updatedContact);
        }
    },
    delete: async (req, res) => {
        const { id } = req.params;

        const updatedRows = await knex('contacts').where({ id }).del();

        if (updatedRows) {
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    }
};
