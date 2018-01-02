var expect = require('expect')
var {generateMessage} = require('./message')

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