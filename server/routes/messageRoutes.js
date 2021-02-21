const express = require('express')
const router = express.Router()

const messageController = require('../controllers/messageController')

router.use(messageController.verification)

router.post('/', messageController.postMessages)

router.get('/group', messageController.getGroupMessages)
router.post('/group', messageController.postGroupMessages)

router.get('/conversations', messageController.getConversations)

router.get('/conversations/query', messageController.getMessagesConversation)

module.exports = router