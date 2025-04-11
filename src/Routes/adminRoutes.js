const controller = require("../Controllers/adminController");
const { createAdminValidation, adminLoginValidation } = require("../Validations/adminVal");
// change here
module.exports = [
    {
        method: 'POST',
        path: '/admin/add-admin',
        options: {
            tags: ['api', 'Admin'],
            description: "Create New Admin",
            handler: controller.addNewAdmin,
            validate: {
                ...createAdminValidation,
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
        method: 'POST',
        path: '/admin/admin-login',
        options: {
            tags: ['api', 'Admin'],
            description: "Admin Login",
            handler: controller.adminLogin,
            validate: {
                ...adminLoginValidation,
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