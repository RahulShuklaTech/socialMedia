const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    owner: { 
        type: [mongoose.SchemaTypes.ObjectId],
        required: true,
        unique: true,
        ref: 'users'
    },

    likes: { 
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "users"
    },

    content: {
        type: String,
        required: true
    }

       


}, {timestamps :true});


const postModel = new mongoose.model('posts', postSchema);

module.exports = postModel