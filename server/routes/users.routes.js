const express = require("express")
const router = express.Router()

const UserController = require('../controllers/user.controller')

router.get('/', UserController.authenticated)

router.post('/register', UserController.register)

router.post('/login', UserController.login)

router.route('/profile')
    .get(UserController.getProfile)
    .put(UserController.updateProfile)

module.exports = router
