const express = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('./users-model')
const restrict = require('../middleware/restrict')
const { isValid } = require('./users-service');

const router = express.Router()



router.get('/users', restrict, (req, res, next)=>{
    console.log('in the get route')
 Users.find().then(users=>{res.status(200).json(users);
        
    }).catch(err => res.send(err));
});


router.post('/register', async (req, res, next)=>{
    const credentials = req.body;
    console.log(credentials)
    try {
        if(isValid(credentials)){
            const hash = bcryptjs.hashSync(credentials.password, 10);
            credentials.password = hash;

            const user = await Users.add(credentials);
            const token = generateToken(user);
            res.status(201).json({ data: user, token});
        }else {
            next({ apiCode: 400, apiMessage: 'username or password missing'});
        }
    } catch (err){
        next({ apiCode: 500, apiMessage: 'error saving new user', err});
    }
        
})

router.post('/login', async(req, res, next)=>{
    const {username, password } = req.body

    try{
        if(!isValid(req.body)){
            next({apiCode: 400, apiMessage: "Incomplete login information"})
        }else{
            const [user] = await Users.findBy({ username: username});
            if (user && bcryptjs.compareSync(password, user.password)){
                const token = generateToken(user);
                res.status(200).json({message: `Welcome, ${user.username}!`, token: token});
            } else {
                next({ apiCode: 401, apiMessage: "You shall not pass!"});
            }
        }
    } catch (err){
        next({ apiCode: 500, apiMessage: 'error logging in', ...err})
    }
});

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

function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
      role: user.department
    };
    const options = {
      expiresIn: "1d"
    };
   
    const secret = process.env.JWT_SECTRET || "tra-la-la";
  
    const token = jwt.sign(payload, secret, options);
    return token;
  }

module.exports = router;