const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const keys = require('../config/key')
const User = require('../models/userModel')
const verify = require('../utils/verify-token')
const validateLoginInput = require('../validator/login')
const validateRegisterInput = require('../validator/register')

// @desc    Authenticated
// @route   [GET] /api/users/
exports.authenticated = async function(req, res) {
    try {
        let jwtUser = jwt.verify(verify(req), key.secretOrKey)
        let id = mongoose.Types.ObjectId(jwtUser.id)

        User.aggregate()
            .match({ _id: { $not: { $eq: id }}})
            .project({
                password: 0,
                __v: 0,
                date: 0,
            })
            .exec((err, users) => {
                if(err) {
                    console.log(err)
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ message: "Failure" }));
                    res.sendStatus(500);
                } else {
                    res.send(users)
                }
            })
    } catch(err) {
        console.log(err);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Unauthorized" }));
        res.sendStatus(401);
    }
}

// @desc    Register
// @route   [POST] /api/users/register
exports.register = async function(req, res) {
    const { errors, isValid } = validateRegisterInput(req.body)

    if(!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({ username: req.body.username }).then((user) => {
        if(user) {
            return res.status(400).json({ message: 'Username already exist'})
        } else {
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err

                    newUser.password = hash
                    newUser.save()
                        .then((user) => {
                            const payload = {
                                id: user.id,
                                name: user.name,
                            }

                            jwt.sign(
                                payload, 
                                keys.secretOrKey, 
                                { expiresIn: 31556926 }, 
                                (err, token) => {
                                    if(err) {
                                        console.log(err)
                                    } else {
                                        req.io.sockets.emit('users', user.username)
                                        res.json({
                                            success: true,
                                            token: 'Bearer ' + token,
                                            name: user.name,
                                        })
                                    }
                                }
                            )
                        })
                        .catch((err) => console.log(err))
                })
            })
        }
    })
}

// @desc    Login
// @route   [POST] /api/users/login
exports.login = async function(req, res) {
    const { errors, isValid } = validateLoginInput(req.body)

    if(!isValid) {
        return res.status(400).json(errors)
    }

    const username = req.body.username
    const password = req.body.password

    User.findOne({ username }).then((user) => {
        if(!user) {
            return res.status(404).json({ usernameNotfound: 'Username not found '})
        }

        bcrypt.compare(password, user.password).then((isMatch) => {
            if(isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name,
                }

                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926,
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token,
                            name: user.name,
                            username: user.username,
                            userId: user._id,
                        })
                    }
                )
            } else {
                return res.status(400).json({ passwordIncorrect: 'Password Incorrect'})
            }
        })
    })
}