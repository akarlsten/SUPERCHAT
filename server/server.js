const express = require('express')
const socketIO = require('socket.io')

const path = require('path')
const http = require('http')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

var app = express()
var server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

app.get('/', (req, res) => {
  app.render('index.html')
})

io.on('connection', (socket) => {
  console.log('New user connected')

  socket.emit('newMessage', {
    from: 'hii',
    text: 'dsf',
    createdAt: 'sdf'
  })

  socket.on('createMessage', (message) => {
    console.log(message)
  })
  
  socket.on('disconnect', (socket) => {
    console.log('User disconnected')
  })
})


server.listen(port, () => {
  console.log(`Server up on port: ${port}\nCTRL+C to shut down..`)
})