require('dotenv').config()
const http = require('http')
const express = require('express')
const cors = require('cors')
const connectDB = require('./db')
const { Server } = require('socket.io')
const pollRoutes = require("./routes/poll.js")
const Poll = require('./models/Poll.js')

connectDB();

const app  = express()
const httpserver = http.createServer(app)


//socket
const io = new Server(httpserver,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }

});

app.set('io', io);

app.use(express.json());
app.use(cors({origin:'*'}))

app.get('/',(req , res)=>{
    res.json({message:"server is running properly on server"})
})
app.use('/api/polls',pollRoutes)


//socket events

io.on('connection',(socket)=>{
    console.log("client connected",socket.id)

    socket.on('joinpoll',(pollId)=>{
        socket.join(pollId)
    })

    //exit poll
    socket.on('disconnect',()=>{
        console.log('client disconnected')
    })

})








const PORT = process.env.PORT || 5001;


httpserver.listen(PORT,()=>{
    console.log(`Livepoll server is running`);
})






