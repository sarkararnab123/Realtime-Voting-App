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

app.use(express.json());
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
    //handle poll submission
    socket.on('submitvote',async({pollId,optionIndex})=>{
        try {
            const poll = await Poll.findById(pollId)
            if(!poll){
                return;
            }
            poll.options[optionIndex].votes+=1;
            poll.totalvotes+=1;
            await poll.save;
            //broadcast
            io.to(pollId).emit('pollupdated',poll)
        } catch (error) {
            console.log("vote error by socket")
        }
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






