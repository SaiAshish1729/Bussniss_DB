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
    },
    amount_recived_mode: {
        type: String,
        default: null
    },
    status: {
        type: String,
    }
});


const Transactions = new mongoose.model("transactions", transactionSchema);

module.exports = Transactions