const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/Auth');
const { ConnectionRequest } = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId',async(req,res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['ignored','interested'];
        if(!allowedStatus.includes(status))
        {
            throw new Error('Invalid status type')
        }

        if (toUserId.equals(fromUserId)) {
            throw new Error('Cannot send request to yourself');
          }          

        const toUser = await User.findById(toUserId);
        if(!toUser)
            throw new Error('User not found')

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId: toUserId,toUserId:fromUserId}
            ]
        })

        if(existingConnectionRequest)
            throw new Error('Connection request already exists')

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();
        res.json({
            message: 'Connection request sent successfully',
            data
        })

    } catch (error) {
        res.status(400).send('Error ' + error.message )
    }
})

requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res) => {
try {
    const loggedInUser = req.user;
    const {status,requestId} = req.params
    const allowedStatus = ['accepted','rejected'];
    if(!allowedStatus.includes(status))
    {
        throw new Error('Status not allowed')
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status: 'interested'
    })
    if(!connectionRequest)
        throw new Error('Connection request not found');
    connectionRequest.status = status;
    const data = await connectionRequest.save()
    req.json({
        message: 'Connection request saved',
        data
    })
    
} catch (error) {
    res.status(400).send('Error ' + error.message)
}
})


module.exports = requestRouter;