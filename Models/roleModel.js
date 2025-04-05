const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
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

const Role = new mongoose.model("roles", roleSchema);

module.exports = Role