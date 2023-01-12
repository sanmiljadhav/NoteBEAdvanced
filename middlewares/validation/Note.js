const { check} = require('express-validator');



exports.validateNote = [
    check('title').trim().not().isEmpty().withMessage('Title must be empty').custom((value,{req})=>{
        if(value.length < 4){
            throw new Error('Title must be greater than 3 characters')
        }
        return true;

    }),
    check('description').trim().not().isEmpty().withMessage('Description must not be empty').custom((value,{req})=>{
       
        if(value.length < 9){
            throw new Error('Description must be atleast greater than 8 characters')
        }
        return true;             //if we return true then execute the next function
    }),
]