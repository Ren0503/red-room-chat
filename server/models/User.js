const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema for Users
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    },
    avatar: {
        type: String,
    }
})

module.exports = User = mongoose.model('users', UserSchema)
