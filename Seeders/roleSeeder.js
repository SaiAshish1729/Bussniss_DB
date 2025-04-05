const Role = require("../Models/roleModel.js");
const { ROLES } = require("../src/utills/index.js");

const seedRoles = async () => {
    try {
        const roles = Object.values(ROLES);
        const existingRoles = await Role.find({}, "role");
        const existingRoleNames = existingRoles.map(role => role.role);

        // Filter out roles that are not already in the database
        const newRoles = roles.filter(role => !existingRoleNames.includes(role));

        if (newRoles.length > 0) {
            await Role.insertMany(newRoles.map(role => ({ role })));
            console.log("New roles added:", newRoles);
        } else {
            console.log("No new roles to add.");
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { seedRoles };
