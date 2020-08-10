require("dotenv").config()

const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const usersRouter = require('./users/users-router')

const server = express()
const port = process.env.PORT || 5000

server.use(helmet())
server.use(cors())
server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "keep a secret"
}))
server.use(bodyParser.json())

server.use((err, req, res, next)=>{
    console.log(err)
    res.status(500).json({
        message: 'Something went wrong',
    })
})

server.listen(port, ()=>{
    console.log(`Running at http://localhost:${port}`)
})
server.use(usersRouter)