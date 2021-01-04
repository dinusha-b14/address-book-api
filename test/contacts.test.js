'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const { knex } = require('../lib/db');
const { cleanDb } = require('./support/dbCleaner');

beforeEach(async () => {
    await cleanDb(); 
});

describe('GET /v1/contacts', () => {
    describe('when there are no contacts in the database', () => {
        it('returns an empty array with a 200 respnse', async () => {
            const response = await request(app).get('/v1/contacts');

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.eql([]);
        });
    });

    describe('when contacts exist in the database', () => {
        it('returns the list of contacts', async () => {
            const [createdContactOne] = await knex('contacts')
                .insert({
                    first_name: 'Jake',
                    last_name: 'Peralta',
                    email: 'jake.peralta@theninenine.com'
                }, ['id', 'created_at as createdAt', 'updated_at as updatedAt']);

            const [createdContactTwo] = await knex('contacts')
                .insert({
                    first_name: 'Amy',
                    last_name: 'Santiago',
                    email: 'amy.santiago@theninenine.com'
                }, ['id', 'created_at as createdAt', 'updated_at as updatedAt']);

            const [createdContactThree] = await knex('contacts')
                .insert({
                    first_name: 'Terry',
                    last_name: 'Jeffords',
                    email: 'terry.jeffords@theninenine.com'
                }, ['id', 'created_at as createdAt', 'updated_at as updatedAt']);

            const response = await request(app).get('/v1/contacts');

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.eql([
                {
                    id: createdContactOne.id,
                    firstName: 'Jake',
                    lastName: 'Peralta',
                    email: 'jake.peralta@theninenine.com',
                    createdAt: createdContactOne.createdAt.toISOString(),
                    updatedAt: createdContactOne.updatedAt.toISOString()
                },
                {
                    id: createdContactTwo.id,
                    firstName: 'Amy',
                    lastName: 'Santiago',
                    email: 'amy.santiago@theninenine.com',
                    createdAt: createdContactTwo.createdAt.toISOString(),
                    updatedAt: createdContactTwo.updatedAt.toISOString()
                },
                {
                    id: createdContactThree.id,
                    firstName: 'Terry',
                    lastName: 'Jeffords',
                    email: 'terry.jeffords@theninenine.com',
                    createdAt: createdContactThree.createdAt.toISOString(),
                    updatedAt: createdContactThree.updatedAt.toISOString()
                }
            ]);
        });
    });
});

describe('GET /v1/contacts/:id', () => {
    describe('when the contact for the provided ID cannot be found', () => {
        it('returns 404', async () => {
            const response = await request(app).get('/v1/contacts/829392');
            expect(response.statusCode).to.equal(404);
        });
    });

    describe('when the contact for the ID can be found', () => {
        it('returns 200 with the details of the contact', async () => {
            await knex('contacts').insert({ first_name: 'Jake', last_name: 'Peralta', email: 'jake.peralta@theninenine.com' });
            await knex('contacts').insert({ first_name: 'Amy', last_name: 'Santiago', email: 'amy.santiago@theninenine.com' });
            const [{ id, createdAt, updatedAt }] = await knex('contacts')
                .insert({
                    first_name: 'Terry',
                    last_name: 'Jeffords',
                    email: 'terry.jeffords@theninenine.com'
                }, ['id', 'created_at as createdAt', 'updated_at as updatedAt']);

            const response = await request(app).get(`/v1/contacts/${id}`);

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.eql({
                id,
                firstName: 'Terry',
                lastName: 'Jeffords',
                email: 'terry.jeffords@theninenine.com',
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString()
            });
        });
    });
});

describe('POST /v1/contacts', () => {
    describe('when payload is invalid', () => {
        describe('when firstName is blank', () => {
            it('returns 400 with an error response', async () => {
                const response = await request(app)
                    .post('/v1/contacts')
                    .send({
                        firstName: '',
                        lastName: 'Santiago',
                        email: 'amy.santiago@theninenine.com'
                    });
    
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.eql({
                    message: 'Bad Request',
                    errors: [ '"firstName" is not allowed to be empty' ]
                });
            });
        });

        describe('when lastName is blank', () => {
            it('returns 400 with an error response', async () => {
                const response = await request(app)
                    .post('/v1/contacts')
                    .send({
                        firstName: 'Amy',
                        lastName: '',
                        email: 'amy.santiago@theninenine.com'
                    });
    
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.eql({
                    message: 'Bad Request',
                    errors: [ '"lastName" is not allowed to be empty' ]
                });
            });
        });

        describe('when email is blank', () => {
            it('returns 400 with an error response', async () => {
                const response = await request(app)
                    .post('/v1/contacts')
                    .send({
                        firstName: 'Amy',
                        lastName: 'Santiago',
                        email: ''
                    });
    
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.eql({
                    message: 'Bad Request',
                    errors: [ '"email" is not allowed to be empty' ]
                });
            });
        });

        describe('when email is not a valid email', () => {
            it('returns 400 with an error response', async () => {
                const response = await request(app)
                    .post('/v1/contacts')
                    .send({
                        firstName: 'Amy',
                        lastName: 'Santiago',
                        email: 'amysantiago.theninenine.com'
                    });
    
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.eql({
                    message: 'Bad Request',
                    errors: [ '"email" must be a valid email' ]
                });
            });
        });
    });

    describe('when payload is valid', () => {
        describe('when a contact with the same email already exists', () => {
            it('returns 409 conflict status', async () => {
                await knex('contacts').insert({ first_name: 'Amy', last_name: 'Santiago', email: 'amy.santiago@theninenine.com' });

                const response = await request(app)
                    .post('/v1/contacts')
                    .send({
                        firstName: 'Amy',
                        lastName: 'Santiago',
                        email: 'amy.santiago@theninenine.com'
                    });

                const [{ count }] = await knex('contacts').count('id');

                expect(response.statusCode).to.equal(409);
                expect(count).to.equal('1'); // Ensure that the number of contacts have not changed.
            });
        });

        describe('when a contact with the same email address does not exist', () => {
            it('returns 201 created status with the payload of the contact that was created', async () => {
                const response = await request(app)
                    .post('/v1/contacts')
                    .send({
                        firstName: 'Amy',
                        lastName: 'Santiago',
                        email: 'amy.santiago@theninenine.com'
                    });

                const [{ id, firstName, lastName, email, createdAt, updatedAt }] = await knex
                    .select('id', 'first_name as firstName', 'last_name as lastName', 'email', 'created_at as createdAt', 'updated_at as updatedAt')
                    .where({ email: 'amy.santiago@theninenine.com' })
                    .from('contacts');
                
                expect(response.statusCode).to.equal(201);
                expect(response.body).to.eql({
                    id,
                    firstName,
                    lastName,
                    email,
                    createdAt: createdAt.toISOString(),
                    updatedAt: updatedAt.toISOString()
                });
            });
        });
    });
});

describe('PATCH /v1/contacts/:id', () => {
    describe('when payload is invalid', () => {
        describe('when firstName is blank', () => {
            it('returns 400 with an error response', async () => {
                const response = await request(app)
                    .patch('/v1/contacts/823798242')
                    .send({
                        firstName: ''
                    });
    
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.eql({
                    message: 'Bad Request',
                    errors: [ '"firstName" is not allowed to be empty' ]
                });
            });
        });

        describe('when lastName is blank', () => {
            it('returns 400 with an error response', async () => {
                const response = await request(app)
                    .patch('/v1/contacts/823798242')
                    .send({
                        lastName: ''
                    });
    
                expect(response.statusCode).to.equal(400);
                expect(response.body).to.eql({
                    message: 'Bad Request',
                    errors: [ '"lastName" is not allowed to be empty' ]
                });
            });
        });
    });

    describe('when contact for the provided ID cannot be found', () => {
        it('returns 404 status', async () => {
            const response = await request(app)
                .patch('/v1/contacts/823798242')
                .send({
                    firstName: 'Terry'
                });
            
            expect(response.statusCode).to.equal(404);
        });
    });

    describe('when contact for the provided ID can be found', () => {
        it('updates the contact and returns a 200 status with the payload of the updated contact', async () => {
            await knex('contacts').insert({ first_name: 'Amy', last_name: 'Santiago', email: 'amy.santiago@theninenine.com' });

            const [{ id }] = await knex.select('id')
                .where({ email: 'amy.santiago@theninenine.com' })
                .from('contacts');

            const response = await request(app)
                .patch(`/v1/contacts/${id}`)
                .send({
                    firstName: 'Ames',
                    lastName: 'Morello'
                });
            
            const [{ createdAt, updatedAt }] = await knex
                .select('created_at as createdAt', 'updated_at as updatedAt')
                .where({ id })
                .from('contacts');
            
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.eql({
                id,
                firstName: 'Ames',
                lastName: 'Morello',
                email: 'amy.santiago@theninenine.com',
                createdAt: createdAt.toISOString(),
                updatedAt: updatedAt.toISOString()
            });
            expect(createdAt.toISOString()).to.not.equal(updatedAt.toISOString()); // Ensure that the updatedAt value is now different.
        });
    });
});

describe('DELETE /v1/contacts/:id', () => {
    describe('when contact for the ID cannot be found', () => {
        it('returns 404 not found status', async () => {
            const response = await request(app).delete('/v1/contacts/87293234');
            expect(response.statusCode).to.equal(404);
        });
    });

    describe('when contact for the ID can be found', () => {
        it('returns 200 after deleting the contact', async () => {
            const [{ id }] = await knex('contacts')
                .insert({
                    first_name: 'Terry',
                    last_name: 'Jeffords',
                    email: 'terry.jeffords@theninenine.com'
                }, ['id']);

            const response = await request(app).delete(`/v1/contacts/${id}`);

            const [deletedContact] = await knex('contacts').select('id').where({ id }).from('contacts');

            expect(response.statusCode).to.equal(200);
            expect(deletedContact).to.be.undefined;
        });
    });
});
