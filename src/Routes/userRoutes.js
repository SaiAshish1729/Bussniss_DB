const controller = require("../Controllers/userController");
const { createUserValidation, getAllUserstValidation, getSingleUserstValidation } = require("../Validations/userVal");

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

]