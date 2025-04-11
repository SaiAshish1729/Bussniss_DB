const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    debt_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "debts",
        required: true,
    },
    amount: {
        type: String,
        require: true,
    },
    note: {
        type: String,
        default: null
    },
    amount_recived_mode: {
        type: String,
        default: null
    },
    status: {
        type: String,
        defalt: null
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    },
    deleted_at: {
        type: Date,
        default: null,
    }
});


const Transactions = new mongoose.model("transactions", transactionSchema);

module.exports = Transactions