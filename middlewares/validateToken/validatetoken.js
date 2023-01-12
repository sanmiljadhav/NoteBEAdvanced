const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config()  //reads the dot env file and makes data available in processs.env

console.log('dot',process.env.JWTSECRET)

//Get the user from jwt Token and add the id to request object
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    cons
    return res
      .status(401)
      .send("Please authenticate using a valid token" );
  }
  try {
    const data = jwt.verify(token, process.env.JWTSECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send("Please authenticate using a valid token" );
  }
};

module.exports = fetchUser;
