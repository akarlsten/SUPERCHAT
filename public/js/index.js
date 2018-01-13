var socket = io('/lobby')

socket.on('updateRoomList', function(rooms) {
  //hide the entire window if empty
  if (rooms.length === 0) {
    $('.popular-rooms').css('visibility', 'hidden')
  } else {
    $('.popular-rooms').css('visibility', 'visible')
  }

  //add popular rooms
  var ul = $('<ul></ul>')

  rooms.forEach(function(room) {
    var html = `🏠 ${room.room} - ${room.users} 😄`
    ul.append($('<li></li>').append(html))
  })

  $('.rooms').html(ul)

  var datalist = $('<datalist id="roomselect"></datalist>')

  rooms.forEach(function(room) {
    var opt = $(`<option value="${room.room}">`)

    datalist.append(opt)
  })

  $('[list="roomselect"]').html(datalist)
})

var formValidator = function() {
  var empty = false

  $('input').each(function() {
    if (
      $(this)
        .val()
        .trim().length === 0
    ) {
      empty = true
    }
  })

  if (empty) {
    $('button')
      .attr('disabled', 'disabled')
      .text('Enter Name and Room')
  } else {
    $('button')
      .removeAttr('disabled')
      .text('Join')
  }
}

$('form').keyup(function() {
  formValidator()
})

// also check after going back in the browser (fields will be filled)
$(document).ready(function() {
  formValidator()
})

//also check after picking from list
$('[name="room"]').on('input', function() {
  formValidator()
})

// set and get cookie for username

$('form').on('submit', function() {
  Cookies.set('screenname', $('[name=name]').val())
  Cookies.set('roomname', $('[name=room]').val())
})

$(document).ready(function() {
  if (Cookies.get('screenname')) {
    $('[name=name]').val(Cookies.get('screenname'))
    $('[name=room]').val(Cookies.get('roomname'))
    $('[name=room]').focus()
    formValidator()
  }
})
