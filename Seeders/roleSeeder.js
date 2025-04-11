const Connection = require("../DB/Connection.js");
const Role = require("../Models/roleModel.js");
const { ROLES } = require("../src/utills/index.js");

const seedRoles = async () => {
    try {
        await Connection();
        const roles = Object.values(ROLES);
        const existingRoles = await Role.find({}, "role");
        // console.log(existingRoles)
        const existingRoleNames = existingRoles.map(role => role.role);

        // Filter out roles that are not already in the database
        const newRoles = roles.filter(role => !existingRoleNames.includes(role));

        if (newRoles.length > 0) {
            await Role.insertMany(newRoles.map(role => ({ role })));
            console.log("New roles added:", newRoles);
        } else {
            console.log("No new roles to add.");
        }
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
seedRoles();
module.exports = { seedRoles };
