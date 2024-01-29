//I didn't want it to be in the routes/images.js nor in the server.js and controllers/image.js so I could keep it clean there
//This is just a util I will use to store and handle file data

const multer = require('multer')

const singleStorage = multer.diskStorage({ //register multer middleware
    destination: (req, file, cb) => {
        return cb(null, "./images")
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`) //how the file will be saved as
    }
})

const singleUpload = multer({singleStorage})

exports.multerMiddleware = singleUpload.single('image')