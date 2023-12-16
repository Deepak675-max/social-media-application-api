const mongoose = require('mongoose');

const userPostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'userSchema'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
)

const userPostModel = mongoose.model('user_post', userPostSchema);

module.exports = {
    userPostModel,
};