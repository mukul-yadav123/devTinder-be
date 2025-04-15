const mongoose = require('mongoose')

const connectDb = async() => {
    await mongoose.connect("mongodb+srv://mukuly2002:CxGhs7gvarRUIQdQ@cluster0.6alviqv.mongodb.net/devTinder")
}

module.exports = {
    connectDb
}