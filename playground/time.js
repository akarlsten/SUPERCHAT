// var date = new Date()
// var months = ['Jan', 'Feb', 'Mar']
// console.log(months[date.getMonth()])

var moment = require('moment')
var createdAt = new Date().getTime()
var date = moment(createdAt)
console.log(date.locale('sv').format('Do MMM, YYYY hh:mm:ss'))

var someTimestamp = moment()
  .valueOf()
  .format('Do MMM, YYYY hh:mm:ss')

console.log(someTimestamp)
