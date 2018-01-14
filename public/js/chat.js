var socket = io()

// autoscroll
function scrollToBottom(extra) {
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

// receiving events
socket.on('connect', function() {
  var params = $.deparam(window.location.search)
  params.room = params.room.toUpperCase() //fix this
  socket.emit('join', params, function(err) {
    if (err) {
      alert(err)
      window.location.href = '/'
    }
  })
})

socket.on('disconnect', function() {
  console.log('Disconnected from server')
})

socket.on('updateUserList', function(users) {
  var ul = $('<ul></ul>')

  users.forEach(function(user) {
    var html = `<a title="Write a message below and click to send a PM to this user." class="user-link" data-id=${
      user.id
    }><div class="profile">
    <span class="initial">${user.name[0].toUpperCase()}</span>
    </div> ${user.name}</a>`
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

socket.on('privateMessage', function(message) {
  var template = $('#private-message-template').html()
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

socket.on('imgMessage', function(message) {
  var template = $('#image-template').html()
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

socket.on('changeRoom', function(room) {
  console.log(room)
  var params = $.deparam(window.location.search)

  params.room = encodeURIComponent(room)

  window.location.search = `?name=${params.name}&room=${params.room}`
})

// sending events

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
  $('#message-form input').focus()
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

  locationButton.attr('disabled', 'disabled').text('⏳🗺️')

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr('disabled').text('📍🗺️')
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    },
    function() {
      locationButton.removeAttr('disabled', null).text('📍🗺️')
      alert('Unable to fetch location..')
    }
  )
})

var gifButton = $('#send-gif')
gifButton.on('click', function() {
  gifButton.attr('disabled', 'disabled')
  socket.emit('requestGif', function() {
    scrollToBottom()
    setTimeout(() => {
      gifButton.removeAttr('disabled')
    }, 1000)
  })
})

var dogButton = $('#send-dog')
dogButton.on('click', function() {
  dogButton.attr('disabled', 'disabled')
  socket.emit('requestDog', function() {
    scrollToBottom()
    setTimeout(() => {
      dogButton.removeAttr('disabled')
    }, 1000)
  })
})

//find and set Room, no need to ask the server
$(document).ready(function() {
  var params = $.deparam(window.location.search)
  var template = $('#room-template').html()

  var html = Mustache.render(template, {
    room: params.room.toUpperCase()
  })

  $('#room').append(html)
})

// room-changer modal stuff

$('.modal-box input').keyup(function(e) {
  var roomButton = $('.modal-box button')
  var empty = false

  $('.modal-box input').each(function() {
    if (
      $(this)
        .val()
        .trim().length === 0
    ) {
      empty = true
    }
  })

  if (empty) {
    roomButton.attr('disabled', 'disabled')
  } else {
    roomButton.removeAttr('disabled')
  }
})

$('#room').on('click', function() {
  $('#room-modal').css('display', 'flex')
  $('#room-form input').focus()
})

$('#room-modal').on('click', function(event) {
  if (!$(event.target).closest('.modal-box').length > 0) {
    $('#room-modal').css('display', 'none')
  }
})

$('#room-form').on('submit', function(e) {
  e.preventDefault()
  var params = $.deparam(window.location.search)
  var roomString = $('[name=room]').val()

  params.room = encodeURIComponent(roomString)

  window.location.search = `?name=${params.name}&room=${params.room}`
})

//private messages
$('#users').on('click', '.user-link', function(e) {
  e.preventDefault()
  var userId = $(this).data('id')
  var messageButton = $('#send-message')
  var messageTextbox = $('[name=message]')

  socket.emit(
    'privateMessage',
    {
      target: userId,
      text: messageTextbox.val()
    },
    function() {
      messageTextbox.val('')
      messageButton.attr('disabled', 'disabled')
    }
  )
})
