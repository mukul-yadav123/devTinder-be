const express = require('express');
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validateSignupData} = require('../utils/validation')
const authRouter = express.Router();


authRouter.post('/signup', async(req,res) => {
    try{
        validateSignupData(req)
        const {firstName,lastName,emailId,password} = req.body
        const passwordHash = await bcrypt.hash(password,10)
        const user = new User({
            firstName,lastName,emailId,password:passwordHash
        })
        await user.save()
        res.send('User added successfully')
    }
    catch(err){
        res.status(400).send('Error saving the user' + err.message)
    }
})

authRouter.post('/login',async(req,res) => {
    try{
        const{emailId,password} = req.body;
        const user = await User.findOne({emailId:emailId})
        if(!user)
        {
            throw new Error('Invalid Credentials')
        }
        
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid)
        {
            const token = await jwt.sign({_id:user._id},'Dev@Tinder',{expiresIn: "2d"})
            res.cookie('token',token)
            res.send("Login Successfull")
        }
        else{
            throw new Error('Invalid Credentials')
        }
    }
    catch(err){
        res.status(400).send('Error saving the user' + err.message)
    }
})

authRouter.post('/logout', async(req,res) => {
try {
    res.cookie('token',null,{
        expires:new Date(Date.now())
    });
    res.send('Logged out successfully')
} catch (error) {
    res.status(400).send('Error ' + error.message)
}
})

module.exports = authRouter