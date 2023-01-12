const { check} = require('express-validator');

exports.validateUserSignup = [
    check('name').trim().not().isEmpty().withMessage('Name must not be empty'),
    check('email').trim().normalizeEmail().isEmail().withMessage('Invalid email!'),
    check('password').trim().not().isEmpty().withMessage('Password must not be empty').custom((value,{req})=>{
       
        if(!(value.length >= 3 && value.length <= 18)){
            throw new Error('Password should be min 3 characters and max 8 characters')
        }
        return true;             //if we return true then execute the next function

    }),
    check('confirmpassword').trim().not().isEmpty().withMessage('Confirm Password must not be empty').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Both Password and Confirm Password must be same')
        }
        return true;             //if we return true then execute the next function

    })
]


exports.validateUserLogin = [
    check('email').trim().normalizeEmail().isEmail().withMessage('Invalid email!'),
    check('password').trim().not().isEmpty().withMessage('Password must not be empty').custom((value,{req})=>{
       
        if(!(value.length >= 3 && value.length <= 18)){
            throw new Error('Password should be min 3 characters and max 8 characters')
        }
        return true;             //if we return true then execute the next function
    }),
]