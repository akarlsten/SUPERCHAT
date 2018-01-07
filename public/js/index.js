var socket = io()

socket.on('updateRoomList', function(rooms) {
  //hide the entire window if empty
  if (rooms.length === 0) {
    $('.popular-rooms').hide()
  } else {
    $('.popular-rooms').show()
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

$('form').keyup(function(e) {
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
})

// also check after going back in the browser (fields will be filled)
$(document).ready(function(e) {
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
    $('button').removeAttr('disabled')
  }
})
