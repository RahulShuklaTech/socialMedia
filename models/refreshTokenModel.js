const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    }

    
})

const tokenModel = new mongoose.model("refreshTokens", tokenSchema);

module.exports = tokenModel;