const express = require('express');
const { validateUserSignup,validateUserLogin } = require('../middlewares/validation/User');
const { validationResult} = require('express-validator');
const fetchUser = require('../middlewares/validateToken/validatetoken')

const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config()  //reads the dot env file and makes data available in processs.env

console.log('dot',process.env.JWTSECRET)


//Create a User using: POST "/api/auth/register"
//doesnt require auth
router.post('/register',validateUserSignup,async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        let userData = await User.findOne({email : req.body.email})
        if(userData){
            return res.status(409).json({error:"Sorry a user with this email already exists"})
        }
        
        const saltRounds = 10;
        const salt = await bcrypt.genSaltSync(saltRounds);
        const secPassword = await bcrypt.hash(req.body.password, salt)
        const secConfirmPassword = await bcrypt.hash(req.body.confirmpassword, salt)

    
        await User.create({
            name: req.body.name,
            email:req.body.email,
            password: secPassword,
            confirmpassword:secConfirmPassword
        })
    
        return res.status(200).json("User has been created")
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error')
        
    }  

})



//Authenticate a User using: POST "/api/auth/login"
//doesnt require auth(No login required)
router.post('/login',validateUserLogin,async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {email,password} = req.body;
        let userData = await User.findOne({email : email})
        if(!userData){
            return res.status(400).json({error:"Please try to login with correct credentials"})
        }

        const comparePassword = await bcrypt.compare(password,userData.password);
        if(!comparePassword){
            return res.status(400).json({error:"Please try to login with correct credentials"})
        }
        
        const data = {
            user:{
                id:userData._id
            }
        }

        const authToken = jwt.sign(data, process.env.JWTSECRET);
         //responding to client request with user profile success message and  access token .
        return res.status(200)
        .send({
            user: {
            id: userData._id,
            email: userData.email,
            },
            message: "Logged in successfully",
            authToken: authToken,
        });
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error')
        
    }  

})


//Get Logged in user details using: POST "/api/auth/getuser"
//require auth(login required)
router.get('/getuser',fetchUser,async (req,res)=>{
    
   
    try {
        userId = req.user.id;
        const user = await User.findById(userId)
        console.log("user is",user)
        const {name, email, date,_id} = user;
        const userData = {
            id:_id,
            name:name,
            email:email,
            date:date
        } 

        return res.status(200).send(userData)
     
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error')
        
    }  

})

module.exports = router