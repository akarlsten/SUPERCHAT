var expect = require('expect')
var {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    var message = generateMessage('Adam', 'Hej hej')
    expect(message).toInclude({
      from: 'Adam',
      text: 'Hej hej'
    })
    expect(message.createdAt).toBeA('number')
  })
})

describe('generateLocationMessage', () => {
  it('should generate the correct location object', () => {
    var location = generateLocationMessage('Adam', 55.6157021, 13.0375249)
    expect(location).toInclude({
      from: 'Adam',
      url: 'https://www.google.se/maps?q=55.6157021,13.0375249'
    })
    expect(location.createdAt).toBeA('number')
  })
})