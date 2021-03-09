const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema for Users
const RoomMessageSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    body: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
})

module.exports = RoomMessage = mongoose.model(
    'room_messages',
    RoomMessageSchema
)
