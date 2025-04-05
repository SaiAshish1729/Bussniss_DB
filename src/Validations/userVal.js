const Joi = require('joi');

const createUserValidation = {
    payload: Joi.object({
        name: Joi.string().optional().label("name"),
        contact_no: Joi.string().optional().label("contact_no"),
        address: Joi.string().optional().allow(null, "").label("address"),
        remark: Joi.string().optional().allow(null, "").label("remark"),
        reference: Joi.string().optional().allow(null, "").label("reference"),
        note: Joi.string().optional().allow(null, "").label("note"),

        // Debt related info
        amount_given: Joi.number().optional().label("amount_given"),
        amount_given_mode: Joi.string().optional().label("amount_given_mode"),
        debt_note: Joi.string().optional().allow(null, "").label("debt_note"),
        discussed_money_recive_frequency: Joi.string().optional().allow(null, "").label("discussed_money_recive_frequency"),
    })
}

module.exports = {
    createUserValidation,

}