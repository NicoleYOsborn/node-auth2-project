
const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
        
        try {
         
          const token = req.headers.authorization ?
            req.headers.authorization.split(' ')[1] : '';

          if (token) {
            //   console.log(`we have found the token ${token}`)
            jwt.verify(token, secret, (err, decodedToken) => {
              if (err) {
                  console.log(`this is the error`, err)
                next({ apiCode: 401, apiMessage: 'invalid or missing credentials' });
              } else {
                req.decodedToken = decodedToken;
                next();
              }
            });
          } else {
              
            res.status(401).json({message: 'invalid or missing credentials' });
          }
        } catch (err) {
            
          res.status(500).json({message: 'You shall not pass!'});
        }
      };
