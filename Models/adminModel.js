const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    contact_no: {
        type: String,
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles",
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
        default: null
    }
});

const Admin = new mongoose.model("admins", adminSchema);

module.exports = Admin