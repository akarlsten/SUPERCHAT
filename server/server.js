const express = require('express')
const socketIO = require('socket.io')
const emoji = require('markdown-it-emoji')
const twemoji = require('twemoji')
const mila = require('markdown-it-link-attributes')
const mili = require('markdown-it-linkify-images')
const md = require('markdown-it')('zero', {
  linkify: true
}).enable(['emphasis', 'linkify', 'image'])

const path = require('path')
const http = require('http')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
const {
  generateMessage,
  generateLocationMessage,
  generateServerMessage
} = require('./utils/message')
const { validateString } = require('./utils/validation')
const { Users } = require('./utils/users')

var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var users = new Users()

//markdown and emoji rendering settings
md
  .use(emoji)
  .use(mili, {
    target: '_blank',
    imgClass: 'message-image'
  })
  .use(mila, {
    attrs: {
      target: '_blank',
      rel: 'nooponer'
    }
  })

md.renderer.rules.emoji = function(token, idx) {
  return twemoji.parse(token[idx].content)
}

app.use(express.static(publicPath))

app.get('/', (req, res) => {
  app.render('index.html')
})

//send room updates only to the lobby
const lobby = io.of('/lobby')
lobby.on('connection', socket => {
  lobby.emit('updateRoomList', users.getRoomlist())
})

io.on('connection', socket => {
  socket.on('join', (params, callback) => {
    if (!validateString(params.name) || !validateString(params.room)) {
      return callback('Name and room name are required..')
    }

    socket.join(params.room)
    users.removeUser(socket.id) //remove any previous
    users.addUser(socket.id, params.name, params.room) //add back in

    lobby.emit('updateRoomList', users.getRoomlist()) //send to lobby when someone joins a room

    io.to(params.room).emit('updateUserList', users.getUserlist(params.room)) // find and send users

    socket.emit('serverMessage', generateServerMessage('Welcome to 💥SUPERCHAT!', '🤗'))
    socket.broadcast
      .to(params.room)
      .emit('serverMessage', generateServerMessage(`${params.name} joined!`, '😲'))

    callback()
  })

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id)

    if (user && validateString(message.text)) {
      // Can probably add / commands here by listening to message.text[]
      if (message.text[0] === '/') {
        // send it off somewhere? maybe add it over in utils
        socket.emit('serverMessage', generateServerMessage('Slash commands coming soon!', '😁'))
        return callback()
      } else if (message.text.substring(0, 2) === 'i!') {
        //adding a shortcut to the markdown syntax for image links
        var parsed = message.text.substring(2)
        message.text = `![](${parsed})`
      }
      io.to(user.room).emit('newMessage', generateMessage(user.name, md.render(message.text)))
    }

    callback()
  })

  socket.on('privateMessage', (message, callback) => {
    var user = users.getUser(socket.id)

    if (user && validateString(message.text)) {
      // check if its a real message
      if (user.id === message.target) {
        //check if youre trying to PM yourself and return the function with an error message
        return socket.emit('serverMessage', generateServerMessage('You can\'t PM yourself!', '🙄'))
      } //then actually send it and remove whats in the textbox via callback
      socket.to(message.target).emit('privateMessage', generateMessage(user.name, message.text))
      callback()
    }
  })

  socket.on('createLocationMessage', (coords, callback) => {
    var user = users.getUser(socket.id)

    if (user) {
      io
        .to(user.room)
        .emit(
          'newLocationMessage',
          generateLocationMessage(user.name, coords.latitude, coords.longitude)
        )
    }
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id)
    lobby.emit('updateRoomList', users.getRoomlist()) //send to lobby when someone disconnects
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserlist(user.room))
      io.to(user.room).emit('serverMessage', generateServerMessage(`${user.name} left!`, '😯'))
    }
  })
})

server.listen(port, () => {
  console.log(`Server up on port: ${port}\nCTRL+C to shut down..`)
})
