const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('./users-model')
const restrict = require('../middleware/restrict')

const jsonParser = bodyParser.json()

const router = express.Router()

router.get('/users', restrict(), async (req, res, next)=>{
    try {
        res.json(await Users.find())
    } catch(err) {
        next(err)
    }
})

router.post('/users', jsonParser, async (req, res, next)=>{
    try {
        const {username, password} = req.body
        const user = await Users.findBy({ username }).frst()

        if (user) {
            return res.status(409).json({
                message: "Username is already taken"
            })
        }

        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 14)
        })

        res.status(201).json(newUser)
    } catch(err) {
        next(err)
    }
})

router.post('/login', async(req, res, next)=>{
    try{
        console.log(req.body)
        const {username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if (!passwordValid) {
            return res.status(401).json({
                message: "You shall not pass! "
            })
        }

        const payload = {
            userId: user.id,
            username: user.username,
            department: user.department
        }

        res.json({
            message: `Welcome ${user.username}!`,
            token: jwt.sign(payload, process.env.JWT_SECRET)
        })
    } catch(err) {
        next(err)
    }
})

router.get("/logout", async (req, res, next)=>{
    try {
        //this will delete the session in the database and try to expire the cookie, though it's ultimately up to the client if they delete the cookie or not
        req.session.destroy((err)=>{
            if(err){
                next(err)
            }else {
                res.status(204).end()
            }
        })
    } catch (err){
        next(err)
    }
})

module.exports = router;