const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const keys = require('../config/keys')
const verify = require('../utils/verify-token')

const Room = require('../models/room.model')
const RoomMessage = require('../models/room_message.model')

let jwtUser= null

