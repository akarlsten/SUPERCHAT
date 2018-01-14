const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = low(new FileSync('db.json'))

var initializeDb = () => {
  db
    .defaults({
      messages: []
    })
    .write()
}

var saveToDb = (name, text, room) => {
  db
    .get('messages')
    .push({
      name: name,
      message: text,
      room: room,
      created: Date.now()
    })
    .write()
}

var latestMessages = room => {
  return db
    .get('messages')
    .filter({ room: room })
    .takeRight(5)
    .value()
}

module.exports = { initializeDb, saveToDb, latestMessages }
