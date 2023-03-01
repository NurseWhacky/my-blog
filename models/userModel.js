const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please select a unique username'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please insert a valid email address'],
        unique: true
    },
    roles: {
        type: [String],
        required: true,
        
    }
})