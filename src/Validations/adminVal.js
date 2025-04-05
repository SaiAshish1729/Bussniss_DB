const Joi = require('joi');
const contactNoPattern = /^(\+|\d)[0-9]{7,16}$/;

const createAdminValidation = {
    payload: Joi.object({
        name: Joi.string().required().label('name'),
        email: Joi.string().required().label('email'),
        password: Joi.string().optional().label('password'),
        contact_no: Joi.string().regex(contactNoPattern).message('Please provide a valid contact number').optional().label('contact_no'),
        role_id: Joi.string().optional().label('role_id'),
    }),
};

const adminLoginValidation = {
    payload: Joi.object({
        email: Joi.string().optional().label('email'),
        password: Joi.string().optional().label('password'),
    }),
};

module.exports = {
    createAdminValidation,
    adminLoginValidation,
}