const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'userSchema'
    },
    postId: {
        type: String,
        required: true,
        ref: 'userPostSchema'
    },
    text: {
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
);

const postCommentModel = mongoose.model('comment', commentSchema);

module.exports = {
    postCommentModel,
};
