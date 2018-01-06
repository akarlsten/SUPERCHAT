var socket = io()

socket.on('connect', function() {
  console.log('Connected to server')
})

socket.on('disconnect', function() {
  console.log('Disconnected from server')
})

socket.on('serverMessage', function(message) {
  var li = $('<li class="server-message"></li>')
  li.text(`${message.text}`)

  $('#messages').append(li)
})

socket.on('newMessage', function(message) {
  var template = $('#message-template').html()
  var formattedTime = moment(message.createdAt)
    .locale('sv')
    .format('HH:mm:ss')

  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  })

  $('#messages').append(html)
})

socket.on('newLocationMessage', function(message) {
  var template = $('#location-message-template').html()
  var formattedTime = moment(message.createdAt)
    .locale('sv')
    .format('HH:mm:ss')

  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  })

  $('#messages').append(html)
})

$('#message-form').on('submit', function(e) {
  e.preventDefault()

  var messageTextbox = $('[name=message]')

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: messageTextbox.val()
    },
    function() {
      messageTextbox.val('')
    }
  )
})

$('#message-form input').keyup(function(e) {
  var messageButton = $('#send-message')
  var empty = false

  $('#message-form input').each(function() {
    if ($(this).val().length === 0) {
      empty = true
    }
  })

  if (empty) {
    messageButton.attr('disabled', 'disabled')
  } else {
    messageButton.removeAttr('disabled')
  }
})

var locationButton = $('#send-location')
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Your browser doesn\'t support geolocation')
  }

  locationButton.attr('disabled', 'disabled').text('Sending..')

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr('disabled').text('Send Location')
      socket.emit('createLocationMessage', {
        from: 'User',
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    },
    function() {
      locationButton.removeAttr('disabled', null).text('Send Location')
      alert('Unable to fetch location..')
    }
  )
})
