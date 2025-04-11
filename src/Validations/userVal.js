const Joi = require('joi');
const { TRANSACTION_MODE } = require('../utills');

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

const getSingleUserstValidation = {
    query: Joi.object({
        _id: Joi.string().label("_id"),
    })
}

const depositInstallmentValidation = {
    query: Joi.object({
        debt_id: Joi.string().required().label("debt_id"),
    }),
    payload: Joi.object({
        amount: Joi.number().positive().required().label("amount"),
        note: Joi.string().optional().allow('').label("Note"),
        amount_recived_mode: Joi.string().valid(TRANSACTION_MODE.ONLINE, TRANSACTION_MODE.CASH).required().label("amount_recived_mode")
    })
};

module.exports = {
    createUserValidation,
    getAllUserstValidation,
    getSingleUserstValidation,
    depositInstallmentValidation,
}