const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema for Users
const RoomSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    recipients: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'users' 
    }],
    lastMessage: {
        type: String,
    },
},{
    timestamps: true,
})

module.exports = Room = mongoose.model(
    'room',
    RoomSchema
)