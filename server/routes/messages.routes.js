const express = require('express')
const router = express.Router()

const MessageController = require('../controllers/messages.controller')

// Token verification middleware
router.use(MessageController.verification)

// Get global messages
router.get('/global', MessageController.getGlobalMessages)

// Post global message
router.post('/global', MessageController.postGlobalMessages)

// Get conversations list
router.get('/conversations', MessageController.getConversations)

// Get messages from conversation
// based on to & from
router.get('/conversations/query', MessageController.getConversationMessages)

// Post private message
router.post('/', MessageController.postConversationMessages)

module.exports = router
