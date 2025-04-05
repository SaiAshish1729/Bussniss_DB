const { mongoose } = require("mongoose");
const Admin = require("../../Models/adminModel");
const Role = require("../../Models/roleModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { ROLES } = require("../utills/index")
const addNewAdmin = async (req, h) => {
    try {
        const { name, email, password, contact_no, role_id } = req.payload;

        if (!mongoose.Types.ObjectId.isValid(role_id)) {
            return h.response({ message: "Invalid role_id format." });
        }
        const roleExists = await Role.findById({ _id: role_id });
        if (!roleExists) {
            return res.status(404).send({ message: "No role found with this Id." });
        }
        if (![ROLES.ADMIN].includes(roleExists.role)) {
            return h.response({ message: "Role_id must belongs to Admin!" }).code(401);
        }

        const preAdmin = await Admin.findOne({ email: email });
        if (preAdmin) {
            return h.response({ message: `This Admin (${email}) already exists.` })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Admin({
            name, email, contact_no, password: hashedPassword, role_id,
        });
        await newUser.save()
        return h.response({ success: true, message: "Admin created successfully.", data: newUser }).code(200)
    } catch (error) {
        console.log(error);
        return h.response({ message: "Error occured while inserting admin", error })
    }
}

const adminLogin = async (req, h) => {
    try {
        const { email, password } = req.payload;
        const adminData = await Admin.aggregate([
            { $match: { email } },
            {
                $lookup: {
                    from: "roles",
                    localField: "role_id",
                    foreignField: "_id",
                    as: "role"
                }
            },
            { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } }, // Flatten role array
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    password: 1,
                    contact_no: 1,
                    created_at: 1,
                    updated_at: 1,
                    deleted_at: 1,
                    role: {
                        _id: "$role._id",
                        role: "$role.role"
                    }
                }
            }
        ]);

        if (!adminData.length) {
            return h.response({ message: "Admin does not exist." }).code(403);
        }

        const userExists = adminData[0];

        const isMatch = await bcrypt.compare(password, userExists.password);
        if (!isMatch) {
            return h.response({ message: "Invalid password" }).code(403);
        }
        const token = jwt.sign({ email: userExists.email }, process.env.JWT_SECRET_KEY, {
            expiresIn: "15d"
        });
        return h.response({ success: true, message: "Admin logged in successfully", token: token, data: userExists });
    } catch (error) {
        console.log(error);
        return h.response({ message: "Error occured while admin login", error })
    }
}

module.exports = {
    addNewAdmin,
    adminLogin,
}