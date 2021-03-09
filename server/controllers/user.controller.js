const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const keys = require("../config/keys")
const verify = require("../utils/verify-token")
const validateRegisterInput = require("../validation/register")
const validateLoginInput = require("../validation/login")
const User = require("../models/user.model")

// @desc    Authenticated
// @route   [GET] /api/users/
exports.authenticated = async (req, res) => {
    try {
        let jwtUser = jwt.verify(verify(req), keys.secretOrKey)
        let id = mongoose.Types.ObjectId(jwtUser.id)

        User.aggregate()
            .match({ _id: { $not: { $eq: id } } })
            .project({
                password: 0,
                __v: 0,
                date: 0,
            })
            .exec((err, users) => {
                if (err) {
                    console.log(err)
                    res.setHeader("Content-Type", "application/json")
                    res.end(JSON.stringify({ message: "Failure" }))
                    res.sendStatus(500)
                } else {
                    res.send(users)
                }
            })
    } catch (err) {
        console.log(err)
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ message: "Unauthorized" }))
        res.sendStatus(401)
    }
}

// @desc    Register
// @route   [POST] /api/users/register
exports.register = async (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body)
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.status(400).json({ message: "Email already exists" })
        } else {
            const newUser = new User({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
            })
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err
                    newUser.password = hash
                    newUser
                        .save()
                        .then((user) => {
                            const payload = {
                                id: user.id,
                                username: user.username,
                            }
                            // Sign token
                            jwt.sign(
                                payload,
                                keys.secretOrKey,
                                {
                                    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60), // 1 year in seconds
                                },
                                (err, token) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        req.io.sockets.emit("users", user.email);
                                        res.json({
                                            success: true,
                                            token: "Bearer " + token,
                                            username: user.username,
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
exports.login = async (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body)
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }
    const email = req.body.email
    const password = req.body.password
    // Find user by username
    User.findOne({ email }).then((user) => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ usernamenotfound: "Username not found" })
        }
        // Check password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    username: user.username,
                }
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926, // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token,
                            email: user.email,
                            username: user.username,
                            userId: user._id,
                        })
                    }
                )
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" })
            }
        })
    })
}


