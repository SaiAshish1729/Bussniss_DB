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

const getAllUserstValidation = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1).description('Page number for pagination'),
        limit: Joi.number().integer().min(1).max(15).default(5).description('Number of items per page'),
        search_input: Joi.string().optional().label("search_input"),
    })
}

module.exports = {
    createUserValidation,
    getAllUserstValidation,

}