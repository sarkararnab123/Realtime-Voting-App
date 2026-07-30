import {io} from 'socket.io-client'

const socket = io('http://localhost:5001',{
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

export default socket