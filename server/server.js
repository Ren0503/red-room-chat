const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')

const users = require('./routes/userRoutes')
const messages = require('./routes/messageRoutes')

const app = express()

const port = process.env.PORT || 5000

const server = app.listen(port, () => 
    console.log(`Server running on port ${port}`)
)

const io = require('socket.io').listen(server)

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
)
app.use(bodyParser.json())

app.use(cors())

const db = require('./config/key')(passport)

mongoose.connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Successfully Connected"))
.catch((err) => console.log(err))

app.use(passport.initialize())

require('./config/passport')(passport)

app.use(function(req, res, next) {
    req.io = io
    next()
})

app.use('/api/users', users)
app.use('/api/messages', messages)