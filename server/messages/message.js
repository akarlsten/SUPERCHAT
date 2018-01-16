var moment = require('moment')

var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  }
}

var generateOldMessage = (from, text, createdAt) => {
  return {
    from,
    text,
    createdAt
  }
}

var generateServerMessage = (text, emoji) => {
  return { text, emoji }
}

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.se/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage,
  generateServerMessage,
  generateOldMessage
}
