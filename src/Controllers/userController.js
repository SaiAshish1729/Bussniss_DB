const mongoose = require("mongoose");
const Debt = require("../../Models/debtModel");
const User = require("../../Models/userModel");
const { ROLES } = require("../utills");
const Role = require("../../Models/roleModel");

// const addNewUser = async (req, h) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const { name, contact_no, address, remark, reference, note,
//             // debt related info
//             amount_given, amount_given_mode, debt_note, discussed_money_recive_frequency,
//         } = req.payload;
//         const fetchRole = await Role.findOne({ role: ROLES.DEBT_CUSTOMER });
//         const newUserData = await User({
//             name, contact_no, address, role_id: fetchRole._id, remark, reference, note,
//         });
//         await newUserData.save({ session });
//         const debtInfo = new Debt({
//             user_id: newUserData._id,
//             amount_given, amount_given_mode, debt_note, discussed_money_recive_frequency,
//         })
//         await debtInfo.save({ session });

//         // Commit the transaction
//         await session.commitTransaction();
//         session.endSession();

//         return h.response({
//             success: true, message: "New user details created successfully.",
//             data: newUserData,
//             meta: debtInfo,
//         }).code(200)
//     } catch (error) {
//         console.log(error);
//     }
// };

const addNewUser = async (req, h) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
        const { name, contact_no, address, remark, reference, note,
            // debt related info
            amount_given, amount_given_mode, debt_note, discussed_money_recive_frequency,
        } = req.payload;
        const fetchRole = await Role.findOne({ role: ROLES.DEBT_CUSTOMER });
        const newUserData = await User({
            name, contact_no, address, role_id: fetchRole._id, remark, reference, note,
        });
        await newUserData.save();
        const debtInfo = new Debt({
            user_id: newUserData._id,
            amount_given, amount_given_mode, debt_note, discussed_money_recive_frequency,
        })
        await debtInfo.save();
        return h.response({
            success: true, message: "New user details created successfully.",
            data: newUserData,
            meta: debtInfo,
        }).code(200)
    } catch (error) {
        console.log(error);
    }
};

const allUsersWithDetails = async (req, h) => {
    try {
        // const admin = req.admin;
        // if (![ROLES.ADMIN].includes(admin.role.role)) {
        //     return h.response({ message: "You are not allowed to access this information!" }).code(401);
        // }

        const allUserList = await User.aggregate([
            {
                $lookup: {
                    from: "roles",
                    localField: "role_id",
                    foreignField: "_id",
                    as: "role"
                },
            },
            { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "roles",
                    localField: "role_id",
                    foreignField: "_id",
                    as: "role"
                },
            },
            {
                $lookup: {
                    from: "debts", // ✅ Lookup debts collection
                    localField: "_id", // ✅ User _id
                    foreignField: "user_id", // ✅ Matching user_id in debts
                    as: "debts"
                },
            },


        ]);

        return h.response({
            success: true, message: "New user details created successfully.",
            data: allUserList,
        }).code(200)

    } catch (error) {
        console.log(error);
        return h.response({ message: "Server error while fetching all user's details.", error }).code(500);
    }
}

const fetchSingleUserDetails = async (req, h) => {
    try {

    } catch (error) {
        console.log(error);
        return h.response({ message: "Server error while fetching single user's details.", error }).code(500);
    }
}

module.exports = {
    addNewUser,
    allUsersWithDetails,
    fetchSingleUserDetails,
}