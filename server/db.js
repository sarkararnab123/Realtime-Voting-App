const mongoose = require('mongoose')

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`mongodb connected: ${conn.connection.host}`)
    } catch (error) {
        console.error("mongodb connection error",error.message)
        process.exit(1);
    }
}

module.exports = connectDB;