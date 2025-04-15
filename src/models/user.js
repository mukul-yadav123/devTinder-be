const mongoose = require('mongoose')
const validator = require('validator')


const userSchema = mongoose.Schema({
    firstName: {type: String,required:true,index:true},
    lastName: {type: String},
    emailId: {type: String,
        required:true,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Invalid Email address')
            }
        }
    },
    password: {type: String,required:true},
    age: {type: Number},
    gender: {type: String,
    enum:{
    values: ['Male','Female','Others'],
    message : `{VALUE} is not a valid Gender`    
    }},
    photoUrl:{type:String,
        validate(value)
        {
            if(!validator.isURL(value))
            throw new Error('The url provided is not valid')
        }
    },
    about:{type:String,default:'This is the default about of user'},
    skills:{type:[String]}
},{timestamps:true})

const User = mongoose.model("User",userSchema)

module.exports = User;