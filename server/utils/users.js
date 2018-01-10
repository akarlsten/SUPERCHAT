class Users {
  constructor() {
    this.users = []
  }

  addUser(id, name, room) {
    var user = { id, name, room }
    this.users.push(user)
    return user
  }

  removeUser(id) {
    var removedUser = this.getUser(id)
    if (removedUser) {
      this.users = this.users.filter(user => user.id !== id)
    }
    return removedUser
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0]
  }

  getUserlist(room) {
    var users = this.users.filter(user => user.room === room)
    var namesArray = users.map(user => user)
    return namesArray
  }

  getRoomlist() {
    var rooms = this.users.map(user => user.room)

    // tallies up all the rooms and sorts them by users
    var compressArray = array => {
      var compressed = []
      var copy = array.slice(0)

      for (var i = 0; i < array.length; i++) {
        var myCount = 0

        for (var w = 0; w < copy.length; w++) {
          if (array[i] === copy[w]) {
            myCount++
            delete copy[w]
          }
        }

        if (myCount > 0) {
          var a = new Object()
          a.room = array[i]
          a.users = myCount
          compressed.push(a)
        }
      }
      return compressed
    }

    var roomArray = compressArray(rooms)
    var sortedArray = roomArray.sort((a, b) => {
      return b.users - a.users
    })
    var splicedArray = sortedArray.splice(0, 5)
    return splicedArray
  }
}

module.exports = { Users }
