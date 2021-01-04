'use strict';

const express = require('express');
const app = express();
const contactsHandler = require('./handlers/contactsHandler');
const { createContactSchema, updateContactSchema, contactsValidator } = require('./validators/contactsValidator');

app.use(express.json());

app.get('/v1/contacts', contactsHandler.list);
app.get('/v1/contacts/:id', contactsHandler.show);
app.post('/v1/contacts', contactsValidator(createContactSchema), contactsHandler.create);
app.patch('/v1/contacts/:id', contactsValidator(updateContactSchema), contactsHandler.update);
app.delete('/v1/contacts/:id', contactsHandler.delete);

module.exports = app;
