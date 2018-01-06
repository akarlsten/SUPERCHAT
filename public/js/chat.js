var socket = io()

// autoscroll
function scrollToBottom() {
  //Selectors
  var messages = $('#messages')
  var newMessage = messages.children('li:last-child')
  //Heights
  var clientHeight = messages.prop('clientHeight')
  var scrollTop = messages.prop('scrollTop')
  var scrollHeight = messages.prop('scrollHeight')
  var newMessageHeight = newMessage.innerHeight()
  var lastMessageHeight = newMessage.prev().innerHeight()

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight)
  }
}

// Event listeners
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
  scrollToBottom()
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
  scrollToBottom()
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
  scrollToBottom()
})

$('#message-form').on('submit', function(e) {
  e.preventDefault()
  var messageButton = $('#send-message')
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
  messageButton.attr('disabled', 'disabled')
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
