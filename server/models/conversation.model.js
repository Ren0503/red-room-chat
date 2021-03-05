const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema for Users
const ConversationSchema = new Schema({
    recipients: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'users' 
    }],
    lastMessage: {
        type: String,
    },
},
{
    timestamps: true,
})

module.exports = Conversation = mongoose.model(
    'conversations',
    ConversationSchema
)
