require('dotenv').config()
const http = require('http')
const express = require('express')
const cors = require('cors')
const connectDB = require('./db')
const { Server } = require('socket.io')
const pollRoutes = require("./routes/poll.js")

connectDB();

const app  = express()
const httpserver = http.createServer(app)

const io = new Server(httpserver,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }

});

app.use(express.json());
app.get('/',(req , res)=>{
    res.json({message:"server is running properly on server"})
})
app.use('/api/polls',pollRoutes)

const PORT = process.env.PORT || 5000;

httpserver.listen(PORT,()=>{
    console.log(`Livepoll server is running`);
})



