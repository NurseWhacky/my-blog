const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    // ref
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'A comment must belong to a user'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: true,
    }

})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;