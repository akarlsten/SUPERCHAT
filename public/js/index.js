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
