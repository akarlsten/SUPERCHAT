var expect = require('expect')
var { Users } = require('./users')

describe('Users', () => {
  var users
  beforeEach(() => {
    users = new Users()
    users.users = [
      {
        id: '1',
        name: 'Adam',
        room: 'Roombo'
      },
      {
        id: '2',
        name: 'Adamo',
        room: 'Roombo'
      },
      {
        id: '3',
        name: 'Adami',
        room: 'Roombox'
      }
    ]
  })

  it('should add new user', () => {
    var users = new Users()
    var user = {
      id: 123,
      name: 'Adam',
      room: 'Roomba'
    }

    var resUser = users.addUser(user.id, user.name, user.room)

    expect(users.users).toEqual([user])
  })

  it('should remove the correct user', () => {
    var removedUser = users.removeUser('1')

    expect(users.users).toEqual([
      {
        id: '2',
        name: 'Adamo',
        room: 'Roombo'
      },
      {
        id: '3',
        name: 'Adami',
        room: 'Roombox'
      }
    ])
    expect(removedUser).toEqual({
      id: '1',
      name: 'Adam',
      room: 'Roombo'
    })
  })

  it('should not remove the wrong user', () => {
    var falseUser = users.removeUser('5')
    expect(users.users.length).toBe(3)
    expect(falseUser).toBe(undefined)
  })

  it('should find user', () => {
    var findAdami = users.getUser('3')

    expect(findAdami).toEqual({
      id: '3',
      name: 'Adami',
      room: 'Roombox'
    })
    expect(users.users.length).toBe(3)
  })

  it('should not find user if incorrect', () => {
    var findNoone = users.getUser('5')

    expect(findNoone).toBe(undefined)
    expect(users.users.length).toBe(3)
  })

  it('should get a list of users from Roombo', () => {
    var userList = users.getUserlist('Roombo')

    expect(userList).toEqual(['Adam', 'Adamo'])
  })

  it('should get a list of users from Roombox', () => {
    var userList = users.getUserlist('Roombox')

    expect(userList).toEqual(['Adami'])
  })
})
