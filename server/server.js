const express = require('express')
const path = require('path')

const imageRoutes = require('./routes/image')
const indexListUtil = require('./controllers/indexList')

const PORT = 5000

const app = express()

app.use(express.json())

app.use('/server/images', express.static(path.join(__dirname, 'images')))   //serves static files from folder "/_dirname/images" when there's any request to "server/images"

app.use('/images', imageRoutes)                                             //prefix for all routes to start with /images 

app.listen(PORT, () => {
    try {
        indexListUtil.initializeIndexList()                                 //init the list upon starting server

        console.log(`Listening on port: ${PORT}`)
    }
    catch (err) {
        console.error('app.listen(): Error initializing index list')
    }
})