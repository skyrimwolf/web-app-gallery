const express = require('express')

const imageRoutes = require('./routes/image')

const PORT = 5000

const app = express()

app.use('/images', imageRoutes) //prefix for all routes to start with /images 

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))