const jwt = require('jsonwebtoken');
const adminSecretKey = "akashAdm1nsS3cr3t";
const userSecretKey = "akashUs3rS3cr3t";

// admin auth middleware
const authenticateAdminJwt = (req, res, next) => {
  const authHeader = req.headers.authorization
  if(authHeader){
      const token = authHeader.split(" ")[1];
      jwt.verify(token, adminSecretKey, (err, user) => {
          if(err){
              res.status(403).json({message : "Authentication faied!", err})
          }else{              
              req.username = user.username;
              next();
          }
      })
  }else{
      res.status(403).json({message : "Cannot found auth token"});
  }
}

// user auth middleware
const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization
  if(authHeader){
      const token = authHeader.split(" ")[1];
      jwt.verify(token, userSecretKey, (err, user) => {
          if(err){
              res.status(403).json({message : "Authentication failed!", err})
          }else{
              req.username = user.username;
              next();
          }
      })
  }else{
      res.status(403).json({message : "Cannot found auth token"});
  }
}

module.exports = {
  authenticateAdminJwt,
  authenticateUserJwt,
  adminSecretKey,
  userSecretKey
}