const express  = require('express')
const {userAuth} = require('../middlewares/Auth')
const {validateProfileData,validatePassword} = require('../utils/validation')
const bcrypt = require('bcrypt')
const profileRouter = express.Router()

profileRouter.get('/profile/view',userAuth,async(req,res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
       res.status(400).send('Error' + error.message) 
    }
})

profileRouter.patch('/profile/edit',userAuth,async(req,res) => {
    try {
        if(!validateProfileData(req))
        {
            throw new Error("Invalid edit request")
        }
        const user = req.user;
        Object.keys(req.body).forEach(key => user[key] = req.body[key]);
        await user.save()
        res.send(`${user.firstName},  your profile is updated`)

    } catch (error) {
        
    }
})

profileRouter.patch('/profile/password',userAuth, async(req,res) => 
{
    try {
        const password = req.body.newPassword;
        validatePassword(req);
        const loggedInUser = req.user;
        const samePassword = await bcrypt.compare(password,loggedInUser.password);
        if(samePassword)
            throw new Error('Please type a new Password')
        const hashedPassword = await bcrypt.hash(password,10);
        loggedInUser.password = hashedPassword;
        await loggedInUser.save()
        res.send('password changed')
    } catch (error) {
        res.status(400).send('Error ' + error.message)
    }
})

module.exports = profileRouter