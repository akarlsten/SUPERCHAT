var expect = require('expect')
var { isRealString } = require('./validation')

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var nullString = isRealString(null)
    var numString = isRealString(1)
    var boolString = isRealString(true)

    expect(nullString && numString && boolString).toBe(false)
  })

  it('should reject string with only spaces', () => {
    var spaceString = isRealString('   ')

    expect(spaceString).toBe(false)
  })

  it('should allow string with non-space characters', () => {
    var weirdString = isRealString(' &!"#&/%¤/')

    expect(weirdString).toBe(true)
  })
})
