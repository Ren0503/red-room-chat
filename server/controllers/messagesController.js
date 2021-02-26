const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const keys = require('../config/keys')
const verify = require('../utilities/verify-token')

const Message = require('../models/Message')
const Conversation = require('../models/Conversation')
const GlobalMessage = require('../models/GlobalMessage')

let jwtUser= null

exports.verification = async function(req, res, next) {
    try {
        jwtUser = jwt.verify(verify(req), keys.secretOrKey)
        next()
    } catch (err) {
        console.log(err)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ message: 'Unauthorized' }))
        res.sendStatus(401)
    }
}

// @desc    Get global messages
// @route   [GET] /api/messages/global
exports.getGlobalMessages = async (req, res) => {
    GlobalMessage.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
    .project({
        'fromObj.password': 0,
        'fromObj.__v': 0,
        'fromObj.date': 0,
    })
    .exec((err, messages) => {
        if (err) {
            console.log(err)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Failure' }))
            res.sendStatus(500)
        } else {
            res.send(messages)
        }
    })
}

// @desc    Post global message
// @route   [POST] /api/message/global
exports.postGlobalMessages = async(req, res) => {
    let message = new GlobalMessage({
        from: jwtUser.id,
        body: req.body.body,
    })

    req.io.sockets.emit('messages', req.body.body)

    message.save(err => {
        if (err) {
            console.log(err)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Failure' }))
            res.sendStatus(500)
        } else {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Success' }))
        }
    })
}

// @desc    Get conversations list
// @route   [GET] /api/messages/conversations
exports.getConversations = async(req, res) => {
    let from = mongoose.Types.ObjectId(jwtUser.id)
    Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        },
    ])
    .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
    .project({
        'recipientObj.password': 0,
        'recipientObj.__v': 0,
        'recipientObj.date': 0,
    })
    .exec((err, conversations) => {
        if (err) {
            console.log(err)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Failure' }))
            res.sendStatus(500)
        } else {
            res.send(conversations)
        }
    })
}

// @desc    Get messages from conversation base on to & from
// @route   [GET] /api/messages/conversations/query
exports.getConversationMessages = async(req, res) => {
    let user1 = mongoose.Types.ObjectId(jwtUser.id)
    let user2 = mongoose.Types.ObjectId(req.query.userId)
    Message.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
    .match({
        $or: [
            { $and: [{ to: user1 }, { from: user2 }] },
            { $and: [{ to: user2 }, { from: user1 }] },
        ],
    })
    .project({
        'toObj.password': 0,
        'toObj.__v': 0,
        'toObj.date': 0,
        'fromObj.password': 0,
        'fromObj.__v': 0,
        'fromObj.date': 0,
    })
    .exec((err, messages) => {
        if (err) {
            console.log(err)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Failure' }))
            res.sendStatus(500)
        } else {
            res.send(messages)
        }
    })
}

// @desc    Post messages to conversations
// route    [POST] /api/messages/
exports.postConversationMessages = async(req, res) => {
    let from = mongoose.Types.ObjectId(jwtUser.id)
    let to = mongoose.Types.ObjectId(req.body.to)

    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [jwtUser.id, req.body.to],
            lastMessage: req.body.body,
            date: Date.now(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function(err, conversation) {
            if (err) {
                console.log(err)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ message: 'Failure' }))
                res.sendStatus(500)
            } else {
                let message = new Message({
                    conversation: conversation._id,
                    to: req.body.to,
                    from: jwtUser.id,
                    body: req.body.body,
                })

                req.io.sockets.emit('messages', req.body.body)

                message.save(err => {
                    if (err) {
                        console.log(err)
                        res.setHeader('Content-Type', 'application/json')
                        res.end(JSON.stringify({ message: 'Failure' }))
                        res.sendStatus(500)
                    } else {
                        res.setHeader('Content-Type', 'application/json')
                        res.end(
                            JSON.stringify({
                                message: 'Success',
                                conversationId: conversation._id,
                            })
                        )
                    }
                })
            }
        }
    )
}