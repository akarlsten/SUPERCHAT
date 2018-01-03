var socket = io()

socket.on('connect', function () {
  console.log('Connected to server')
  
})

socket.on('disconnect', function () {
  console.log('Disconnected from server')
})

socket.on('newMessage', function (message) {
  console.log('newMessage', message)
  var li = $('<li></li>')
  li.text(`${message.from}: ${message.text}`)

  $('#messages').append(li)
})

socket.on('newLocationMessage', function (message) {
  console.log('newLocationMessage', message)
  var li = $('<li></li>')
  var a = $('<a target="_blank">My location</a>')
  li.text(`${message.from}: `)
  a.attr('href', message.url)
  li.append(a)

  $('#messages').append(li)
})

$('#message-form').on('submit', function (e) {
  e.preventDefault()
  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val()
  }, function () {

  })
})

var locationButton = $('#send-location')
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Your browser doesn\'t support geolocation')
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      from: 'User',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, function () {

    })
  }, function () {
    alert('Unable to fetch location..')
  })
})