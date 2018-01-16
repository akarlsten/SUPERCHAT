const express = require('express')
const socketIO = require('socket.io')

const path = require('path')
const http = require('http')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const { Users } = require('./utils/users')
const { initializeDb } = require('./utils/database-methods')

const {
  regularMessage,
  privateMessage,
  locationMessage,
  dogMessage,
  gifMessage,
  joinRoom,
  disconnect
} = require('./messages/messagetypes')

var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users()

// create and set up the database if it doesn't exist
initializeDb()

//express and socket.io server
app.use(express.static(publicPath))

app.get('/', (req, res) => {
  app.render('index.html')
})

//send room updates only to the lobby
const lobby = io.of('/lobby')
lobby.on('connection', () => {
  lobby.emit('updateRoomList', users.getTopRooms())
})

io.on('connection', socket => {
  socket.on('join', (params, callback) => {
    joinRoom(io, lobby, users, socket, params, callback)
  })

  socket.on('createMessage', (message, callback) => {
    regularMessage(io, users, socket, message, callback)
  })

  socket.on('privateMessage', (message, callback) => {
    privateMessage(io, users, socket, message, callback)
  })

  socket.on('createLocationMessage', coords => {
    locationMessage(io, users, socket, coords)
  })

  //fun buttons that fetch fun things
  socket.on('requestDog', callback => {
    dogMessage(io, users, socket, callback)
  })

  socket.on('requestGif', callback => {
    gifMessage(io, users, socket, callback)
  })

  socket.on('disconnect', () => {
    disconnect(io, lobby, users, socket)
  })
})

server.listen(port, () => {
  console.log(`Server up on port: ${port}\nCTRL+C to shut down..`)
})
