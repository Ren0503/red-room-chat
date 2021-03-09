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
    avatar: {
        type: String,
    },
    isOnline: {
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true,
})

module.exports = User = mongoose.model('users', UserSchema)
