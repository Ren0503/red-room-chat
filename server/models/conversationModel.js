const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conversationSchema = new Schema({
    recipients: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    lastMessage: {
        type: String,
    },
    date: {
        type: String,
        default: Date.now,
    },
}, {
    timestamps: true,
})

module.exports = Conversation = mongoose.model(
    'conversations',
    conversationSchema
)