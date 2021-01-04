'use strict';

const Joi = require('joi');

const createContactSchema = Joi.object({
    firstName: Joi.string().required()
        .label('firstName')
        .description('The first name of the contact.')
        .example('John'),
    lastName: Joi.string().required()
        .label('lastName')
        .description('The last name of the contact.')
        .example('Smith'),
    email: Joi.string().email()
        .required()
        .label('email')
        .description('The email address of the contact.')
        .example('email')
});

const updateContactSchema = Joi.object({
    firstName: Joi.string()
        .label('firstName')
        .description('The first name of the contact.')
        .example('John'),
    lastName: Joi.string()
        .label('lastName')
        .description('The last name of the contact.')
        .example('Smith')
});

const contactsValidator = validationSchema => {
    return (req, res, next) => {
        const { error } = validationSchema.validate(req.body, { stripUnknown: true });

        if (error) {
            const { details } = error;

            res.status(400).json({
                message: 'Bad Request',
                errors: details.map(detail => detail.message)
            }).end();
        }

        next();
    };
};

module.exports = {
    createContactSchema,
    updateContactSchema,
    contactsValidator
};
