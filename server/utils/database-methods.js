const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

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
