const express = require('express')

const path = require('path')
const publicPath = path.join(__dirname, '../public')

var app = express()
var port = process.env.PORT || 3000

app.use(express.static(publicPath))

app.get('/', (req, res) => {
  app.render('index.html')
})

app.listen(port, () => {
  console.log(`Server up on port: ${port}\nCTRL+C to shut down..`)
})