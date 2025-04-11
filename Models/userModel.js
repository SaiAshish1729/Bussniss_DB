const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact_no: {
        type: String,
    },
    address: {
        type: String,
    },
    remark: {
        type: String,
    },
    reference: {
        type: String,
    },
    note: {
        type: String,
    },
    overall_profit: {
        type: String
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roles",
        required: true,
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
})

const User = new mongoose.model("Users", userSchema);

module.exports = User