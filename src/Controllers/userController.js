const mongoose = require("mongoose");
const Debt = require("../../Models/debtModel");
const User = require("../../Models/userModel");
const { ROLES } = require("../utills");
const Role = require("../../Models/roleModel");
const Transactions = require("../../Models/transactionModel");

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
            // data: newUserData,
            // meta: debtInfo,
        }).code(200)
    } catch (error) {
        console.log(error);
        return h.response({ message: "Internal server error while adding a new user.", error })
    }
};

const allUsersWithDetails = async (req, h) => {
    try {
        // const admin = req.admin;
        // if (![ROLES.ADMIN].includes(admin.role.role)) {
        //     return h.response({ message: "You are not allowed to access this information!" }).code(401);
        // }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;

        const skip = (page - 1) * limit;

        // searching...
        const search = req.query.search_input || "";
        const matchStage = search
            ? {
                $match: {
                    $or: [
                        { name: { $regex: search, $options: "i" }, }, // case-insensitive search
                        { contact_no: { $regex: `^${search}`, $options: "i" } } // search from start
                    ]
                },
            }
            : null;

        const allUserList = await User.aggregate([
            ...(matchStage ? [matchStage] : []),
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
                    from: "debts",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "debts"
                },
            },

            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $count: "total" }
                    ]
                }
            }

        ]);
        return h.response({
            success: true, message: "New user details fetched successfully.",
            data: allUserList,
            meta: {
                Total_users: allUserList[0].totalCount[0]?.total || 0,
                current_page: page,
                limit_per_page: limit,
            },
        }).code(200)

    } catch (error) {
        console.log(error);
        return h.response({ message: "Server error while fetching all user's details.", error }).code(500);
    }
}

const fetchSingleUserDetails = async (req, h) => {
    try {
        const { _id } = req.query;
        const userObjectId = new mongoose.Types.ObjectId(_id);
        const userData = await User.aggregate([
            {
                $match: {
                    _id: userObjectId
                }
            },

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
                    from: "debts",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "debts"
                },
            },

        ]);

        return h.response({ success: true, message: "User details fetched successfully.", data: userData }).code(200);
    } catch (error) {
        console.log(error);
        return h.response({ message: "Server error while fetching single user's details.", error }).code(500);
    }
}

// transaction
const depositInstallment = async (req, h) => {
    try {
        const { debt_id } = req.query;
        const { amount, note, amount_recived_mode, } = req.payload;
        const debtExists = await Debt.findOne({ _id: debt_id });

        if (!debtExists) {
            return h.response({ message: "No any debt found with this Id." }).code(404);
        }

        const createTransaction = await Transactions({
            user_id: debtExists.user_id,
            debt_id: debtExists._id,
            amount, note, amount_recived_mode
        });
        await createTransaction.save();
        return h.response({ success: true, message: "Installment deposited successfully.", data: createTransaction });
    } catch (error) {
        console.log(error);
        return h.response({ message: "Server error while deposit installment.", error }).code(500);
    }
}

// all transactions of a particular debt
const singleDebtsAllTransactions = async (req, h) => {
    try {
        const { user_id, debt_id } = req.payload;
        const userExists = await User.findOne({ _id: user_id });
        if (!userExists) {
            return h.response({ message: "Oops! user not found with this user_id" }).code(404);
        }
        const hasDebt = await Debt.findOne({ _id: debt_id });
        if (!hasDebt) {
            return h.response({ message: "No debt found." }).code(404);
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const allTransactions = await Transactions.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(user_id),
                    debt_id: new mongoose.Types.ObjectId(debt_id)
                }
            },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $count: "total" }
                    ]
                }
            }
        ]);

        const totalCount = allTransactions[0].totalCount[0]?.total || 0;
        const totalPages = Math.ceil(totalCount / limit);

        return h.response({
            success: true, message: "All transaction of provided debt_id fetched successfully.",
            data: allTransactions,
            meta: {
                total_transactions: totalCount,
                current_page: page,
                limit_per_page: limit,
                total_pages: totalPages
            }
        })
    } catch (error) {
        console.log(error);
        return h.response({ message: "Server error while fetching single debt transactions.", error }).code(500);
    }
}

module.exports = {
    addNewUser,
    allUsersWithDetails,
    fetchSingleUserDetails,
    depositInstallment,
    singleDebtsAllTransactions
}