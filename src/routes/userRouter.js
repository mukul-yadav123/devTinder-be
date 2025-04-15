const express = require('express');
const { userAuth } = require('../middlewares/Auth');
const {ConnectionRequest} = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName age photoUrl gender about skills'

userRouter.get('/user/requests/received',userAuth,async(req,res) =>{
try {
    const loggedInUser = req.user
    const connectionRequests = await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
    }).populate("fromUserId",USER_SAFE_DATA)
    // }).populate("fromUserId",["firstName","lastName"])
    res.send(connectionRequests)
} catch (error) {
 res.status(400).send('Error ' + error.message)   
}
})

userRouter.get('/user/connections',userAuth,async(req,res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id,status:'accepted'},
                {fromUserId: loggedInUser._id,status:'accepted'}
            ]
        }).populate('fromUserId',USER_SAFE_DATA).populate('toUserId',USER_SAFE_DATA)
        if(!connectionRequest)
            throw new Error('No connection available');

        const data = connectionRequest.map(row => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString())
                return row.toUserId;
            return row.fromUserId
        })

        res.json({
            message:'Connections fetched successfully',
            data
            })
    } catch (error) {
        res.status(400).send("Error "+ error.message)
    }
})

userRouter.get('/feed',userAuth,async(req,res) => {
try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page-1)*limit;
    const connectionRequest = await ConnectionRequest.find({
        $or: [
            {fromUserId:loggedInUser._id},
            {toUserId: loggedInUser._id}
        ]
    }).select('fromUserId toUserId')

    const hideUsersFromFeed = new Set()
    connectionRequest.forEach((request) => {
        hideUsersFromFeed.add(request.fromUserId)
        hideUsersFromFeed.add(request.toUserId)
    })

    const users = await User.find({
        $and: [
       { _id:{$nin: Array.from(hideUsersFromFeed)}},
       {_id: {$ne: loggedInUser._id}}
        ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)


    res.send(users)
} catch (error) {
    res.status(400).send('Error '+error.message)
}
})

module.exports = userRouter;