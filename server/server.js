const express = require('express')
const socketIO = require('socket.io')

const path = require('path')
const http = require('http')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const {
  generateMessage,
  generateLocationMessage,
  generateServerMessage
} = require('./utils/message')

var app = express()
var server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

app.get('/', (req, res) => {
  app.render('index.html')
})

io.on('connection', socket => {
  console.log('New user connected')

  socket.emit('serverMessage', generateServerMessage('Welcome to the chat app! 🤗'))

  socket.broadcast.emit('serverMessage', generateServerMessage('New user joined! 😲'))

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message)
    io.emit('newMessage', generateMessage(message.from, message.text))
    callback()
  })

  socket.on('createLocationMessage', (coords, callback) => {
    console.log('createLocationMessage', coords)
    io.emit(
      'newLocationMessage',
      generateLocationMessage(coords.from, coords.latitude, coords.longitude)
    )
  })

  socket.on('disconnect', socket => {
    console.log('User disconnected')
  })
})

server.listen(port, () => {
  console.log(`Server up on port: ${port}\nCTRL+C to shut down..`)
})
