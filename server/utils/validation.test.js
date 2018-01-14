var expect = require('expect')
var { validateString } = require('./validation')

describe('validateString', () => {
  it('should reject non-string values', () => {
    var nullString = validateString(null)
    var numString = validateString(1)
    var boolString = validateString(true)

    expect(nullString && numString && boolString).toBe(false)
  })

  it('should reject string with only spaces', () => {
    var spaceString = validateString('   ')

    expect(spaceString).toBe(false)
  })

  it('should allow string with non-space characters', () => {
    var weirdString = validateString(' &!"#&/%¤/')

    expect(weirdString).toBe(true)
  })
})
