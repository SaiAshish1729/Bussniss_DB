const controller = require("../Controllers/userController");
const { createUserValidation, getAllUserstValidation, getSingleUserstValidation, depositInstallmentValidation, singleDebtsAllTransactionsValidations } = require("../Validations/userVal");

module.exports = [
    {
        method: 'POST',
        path: '/user/registration',
        options: {
            tags: ['api', 'User'],
            description: "Create New User",
            handler: controller.addNewUser,
            validate: {
                ...createUserValidation,
                failAction: (request, h, err) => {
                    const customErrorMessages = err.details.map(detail => detail.message);
                    return h.response({
                        statusCode: 400,
                        error: 'Bad Request',
                        message: customErrorMessages
                    }).code(400).takeover();
                }
            },
        }

    },

    {
        method: 'GET',
        path: '/user/all-users',
        options: {
            tags: ['api', 'User'],
            description: "Fetch All Users",
            handler: controller.allUsersWithDetails,
            validate: {
                ...getAllUserstValidation,
                failAction: (request, h, err) => {
                    const customErrorMessages = err.details.map(detail => detail.message);
                    return h.response({
                        statusCode: 400,
                        error: 'Bad Request',
                        message: customErrorMessages
                    }).code(400).takeover();
                }
            },
        }

    },

    {
        method: 'GET',
        path: '/user/users-details',
        options: {
            tags: ['api', 'User'],
            description: "Fetch Single User's details",
            handler: controller.fetchSingleUserDetails,
            validate: {
                ...getSingleUserstValidation,
                failAction: (request, h, err) => {
                    const customErrorMessages = err.details.map(detail => detail.message);
                    return h.response({
                        statusCode: 400,
                        error: 'Bad Request',
                        message: customErrorMessages
                    }).code(400).takeover();
                }
            },
        }

    },

    // deposit installment
    {
        method: 'POST',
        path: '/user/deposit-installment',
        options: {
            tags: ['api', 'User'],
            description: "Deposit Installmen",
            handler: controller.depositInstallment,
            validate: {
                ...depositInstallmentValidation,
                failAction: (request, h, err) => {
                    const customErrorMessages = err.details.map(detail => detail.message);
                    return h.response({
                        statusCode: 400,
                        error: 'Bad Request',
                        message: customErrorMessages
                    }).code(400).takeover();
                }
            },
        }

    },

    // all transactions of a debt_id
    {
        method: 'post',
        path: '/user/all-transactions',
        options: {
            tags: ['api', 'User'],
            description: "Fetch All Transaction By Debt_ID",
            handler: controller.singleDebtsAllTransactions,
            validate: {
                ...singleDebtsAllTransactionsValidations,
                failAction: (request, h, err) => {
                    const customErrorMessages = err.details.map(detail => detail.message);
                    return h.response({
                        statusCode: 400,
                        error: 'Bad Request',
                        message: customErrorMessages
                    }).code(400).takeover();
                }
            },
        }

    },
]