const express = require('express')
const path = require('path')

const imageRoutes = require('./routes/image')

const PORT = 5000

const app = express()

app.use(express.json())

app.use('/server/images', express.static(path.join(__dirname, 'images'))) //serves static files from folder "/_dirname/images" when there's any request to "server/images"

app.use('/images', imageRoutes) //prefix for all routes to start with /images 

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))