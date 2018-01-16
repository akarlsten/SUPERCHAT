const { generateMessage, generateServerMessage } = require('./message')

var slashHandler = (io, users, md, socket, originalmessage) => {
  var user = users.getUser(socket.id)
  var message = originalmessage.substring(1)
  var messageArray = message.split(' ')
  var command = messageArray[0]
  var pmName = messageArray[1]

  switch (command) {
  case 'pm':
    messageArray.splice(0, 2)
    var text = messageArray.join(' ').trim()

    //to see if the username is multi word, then do things differently
    if (pmName[0] === '\'') {
      var quoteArray = message.split('\'')
      pmName = quoteArray[1]
      quoteArray.splice(0, 2)
      text = quoteArray.join(' ').trim()
    }

    var target = users.getUserId(pmName.toUpperCase(), user.room)
    if (!target) {
      return socket.emit('serverMessage', generateServerMessage('No user found!', '🙄'))
    }
    if (user.id === target) {
      return socket.emit('serverMessage', generateServerMessage('You can\'t PM yourself!', '🙄'))
    }
    var recipient = users.getUsername(target)

    socket
      .to(target)
      .emit('privateMessage', generateMessage(`${user.name} > You`, md.render(text)))
    socket.emit('privateMessage', generateMessage(`You > ${recipient}`, md.render(text)))
    break

  case 'room':
    messageArray.splice(0, 1)
    var roomTarget = messageArray.join(' ')
    socket.emit('changeRoom', roomTarget)
    break

  default:
    return socket.emit('serverMessage', generateServerMessage('Unrecognized command!', '🙄'))
  }
}

module.exports = { slashHandler }
