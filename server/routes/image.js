const express = require('express')

const imageController = require('../controllers/image')
const middleware = require('../util/multer')

const router = express.Router()

//GET method on path /images/get-all
router.get('/get-all', imageController.getGetAllImageNames)

//POST method on path /images/upload
router.post('/upload', middleware.multerMiddleware, imageController.postUploadImage)

//GET method on path /images/:imageId
router.get('/download/:imageId', imageController.getDownloadImage)

//POST method on path /images/rotate/:imageId
router.post('/rotate/:imageId', imageController.postRotateImage)     //maybe PUT instead of POST?

//DELETE method on path /images/remove/:imageId
router.delete('/remove/:imageId', imageController.deleteRemoveImage)

module.exports = router