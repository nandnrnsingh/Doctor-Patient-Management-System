const mongoose = require('mongoose');
const colore = require('colors');

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`mongodb connected ${mongoose.connection.host}`.bgGreen.white)
    } 
    catch (error) {
        console.log(`mongodb server issue ${error}`.bgRed.white)
    }
}

module.exports = connectDB;