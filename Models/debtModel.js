const mongoose = require("mongoose");

const debtSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transactions",
        default: null,
    },
    amount_given: {
        type: String,
    },
    amount_given_mode: {
        type: String,
    },
    amount_taken: {
        type: String,
    },
    amount_taken_mode: {
        type: String,
    },
    debt_status: {
        type: String,
        default: "Running"
    },
    debt_note: {
        type: String,
    },
    discussed_money_recive_frequency: {
        type: String,
    },
    discussed_money_recive_frequency_changed_on: {
        type: String,
        default: null,
    },
    total_recived_amount: {
        type: String,
        default: null
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

const Debt = new mongoose.model("debts", debtSchema);

module.exports = Debt;