const express = require('express');
const {connectDb}= require('./config/database')
const app = express();
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profileRoute')
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/userRouter');

app.use(express.json())
app.use(cookieParser())
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)

connectDb()
    .then(() => {
        console.log('Database connected')
        app.listen(3000,() => {
            console.log('server is listening on port 3000')
        })
    })
    .catch((err) => console.error('Database cannot be connected'))