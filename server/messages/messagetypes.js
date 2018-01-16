const axios = require('axios')
const { validateString } = require('./../utils/validation')
const { saveToDb, latestMessages } = require('./../utils/database-methods')
const {
  generateMessage,
  generateLocationMessage,
  generateServerMessage,
  generateOldMessage
} = require('./message')
const { slashHandler } = require('./slashhandler')
const { md } = require('./../utils/markdown')

let joinRoom = (io, lobby, users, socket, params, callback) => {
  if (!validateString(params.name) || !validateString(params.room)) {
    return callback('Name and room name are required..')
  }

  var upperName = params.name.toUpperCase().trim()
  if (users.getUsernames(params.room).includes(upperName)) {
    return callback('A user with that name is already in the room..')
  }

  params.room = params.room.toUpperCase().trim() //fix this
  socket.join(params.room)
  users.removeUser(socket.id) //remove any previous
  users.addUser(socket.id, params.name, params.room) //add back in

  lobby.emit('updateRoomList', users.getTopRooms()) //send to lobby when someone joins a room

  io.to(params.room).emit('updateUserList', users.getUserlist(params.room)) // find and send users

  socket.emit('serverMessage', generateServerMessage('Welcome to 💥SUPERCHAT!', '🤗'))

  //send the last 5 messages from channel to new users
  latestMessages(params.room).forEach(message => {
    io
      .to(message.room)
      .emit(
        'newMessage',
        generateOldMessage(message.name, md.render(message.message), message.created)
      )
  })

  socket.broadcast
    .to(params.room)
    .emit('serverMessage', generateServerMessage(`${params.name} joined!`, '😲'))

  callback()
}

let disconnect = (io, lobby, users, socket) => {
  var user = users.removeUser(socket.id)
  lobby.emit('updateRoomList', users.getTopRooms()) //send to lobby when someone disconnects
  if (user) {
    io.to(user.room).emit('updateUserList', users.getUserlist(user.room))
    io.to(user.room).emit('serverMessage', generateServerMessage(`${user.name} left!`, '😯'))
  }
}

let regularMessage = (io, users, socket, message, callback) => {
  var user = users.getUser(socket.id)
  if (user && validateString(message.text)) {
    // Can probably add / commands here by listening to message.text[]
    if (message.text.substring(0, 1) === '/') {
      // send it off somewhere? maybe add it over in utils
      slashHandler(io, users, md, socket, message.text)
      return callback()
    } else if (message.text.substring(0, 2) === 'i!') {
      //adding a shortcut to the markdown syntax for image links
      var parsed = message.text.substring(2)
      message.text = `![](${parsed})`
    }
    saveToDb(user.name, message.text, user.room)
    io.to(user.room).emit('newMessage', generateMessage(user.name, md.render(message.text)))
  }
  callback()
}

let privateMessage = (io, users, socket, message, callback) => {
  var user = users.getUser(socket.id)
  var recipient = users.getUsername(message.target)

  if (user && validateString(message.text)) {
    if (user.id === message.target) {
      return socket.emit('serverMessage', generateServerMessage('You can\'t PM yourself!', '🙄'))
    } //then actually send it and remove whats in the textbox via callback

    socket
      .to(message.target)
      .emit('privateMessage', generateMessage(`${user.name} > You`, md.render(message.text)))
    socket.emit('privateMessage', generateMessage(`You > ${recipient}`, md.render(message.text)))
    callback()
  }
}

let locationMessage = (io, users, socket, coords) => {
  var user = users.getUser(socket.id)

  if (user) {
    io
      .to(user.room)
      .emit(
        'newLocationMessage',
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      )
  }
}

let dogMessage = (io, users, socket, callback) => {
  var user = users.getUser(socket.id)

  if (user) {
    axios
      .get('https://random.dog/woof.json')
      .then(response => {
        var dogUrl = response.data.url

        // we cant handle webms
        if (
          dogUrl.substring(dogUrl.length - 4) === 'webm' ||
          dogUrl.substring(dogUrl.length - 4) === '.mp4'
        ) {
          throw 'webm'
        }

        saveToDb(user.name, `![](${dogUrl})`, user.room)
        io.to(user.room).emit('dogMessage', generateMessage(user.name, md.render(`![](${dogUrl})`)))
        callback()
      })
      .catch(() => {
        socket.emit(
          'serverMessage',
          generateServerMessage('Looks like we couldn\'t find a dog..', '😭')
        )
        callback()
      })
  }
}

let gifMessage = (io, users, socket, callback) => {
  var user = users.getUser(socket.id)
  if (user) {
    var apiKey = 'blYIyZTY0W3gHxXxpCSWcliximKB3esJ' //hide this later :-)
    axios
      .get(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`)
      .then(response => {
        var gifUrl = response.data.data.image_url
        var gifHeight = response.data.data.image_height
        var gifWidth = response.data.data.image_width

        saveToDb(user.name, `![](${gifUrl})`, user.room)
        io
          .to(user.room)
          .emit(
            'imgMessage',
            generateMessage(user.name, md.render(`![](${gifUrl} =${gifWidth}x${gifHeight})`))
          )
        callback()
      })
      .catch(() => {
        socket.emit(
          'serverMessage',
          generateServerMessage('Looks like we can\'t find any GIFs..', '😣')
        )
        callback()
      })
  }
}

module.exports = {
  regularMessage,
  privateMessage,
  locationMessage,
  dogMessage,
  gifMessage,
  joinRoom,
  disconnect
}
