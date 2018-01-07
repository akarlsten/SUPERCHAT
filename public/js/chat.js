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
  var params = $.deparam(window.location.search)

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err)
      window.location.href = '/'
    } else {
    }
  })
})

socket.on('disconnect', function() {
  console.log('Disconnected from server')
})

socket.on('updateUserList', function(users) {
  // var template = $('#users-template').html()
  // var initial
  // var user = users.forEach(function(user) {
  //   initial = user[0]
  //   return user
  // })

  // var html = Mustache.render(template, {
  //   user: user,
  //   initial: initial
  // })

  // $('#users ul').append(html)
  var ul = $('<ul></ul>')

  users.forEach(function(user) {
    var html = `<div class="profile"><span class="initial">${user[0].toUpperCase()}</span></div> ${user}`
    ul.append($('<li></li>').append(html))
  })

  $('#users').html(ul)
})

socket.on('serverMessage', function(message) {
  var template = $('#server-template').html()
  var html = Mustache.render(template, {
    text: message.text,
    emoji: message.emoji
  })

  $('#messages').append(html)
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
    if (
      $(this)
        .val()
        .trim().length === 0
    ) {
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

  locationButton.attr('disabled', 'disabled').text('📍🗺️ ⏳ 💬')

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr('disabled').text('📍🗺️ ⟶ 💬')
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    },
    function() {
      locationButton.removeAttr('disabled', null).text('📍🗺️ ⟶ 💬')
      alert('Unable to fetch location..')
    }
  )
})

//find and set Room, no need to ask the server
$(document).ready(function() {
  var params = $.deparam(window.location.search)
  var template = $('#room-template').html()

  var html = Mustache.render(template, {
    room: params.room
  })

  $('#room').append(html)
})
