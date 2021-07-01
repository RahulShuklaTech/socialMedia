const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: { 
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    posts: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "posts"
    },

    followers: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "users"
    }   


}, {timestamps :true});


const userModel = new mongoose.model('Users', userSchema);

module.exports = userModel