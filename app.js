if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use('/',require('./routers'))

module.exports = app

