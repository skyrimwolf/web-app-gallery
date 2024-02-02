//NOTE: I didn't want it to be in the routes/images.js nor in the server.js and controllers/image.js so I could keep it clean there
//      This is just a util I will use to store and handle file data

const multer = require('multer')
const path = require('path')

const rootDir = require('./path')
const uniqueNameUtil = require('./uniqueName')
const indexListController = require('../controllers/indexList')

const singleStorage = multer.diskStorage({                                                                          //register multer middleware
    destination: (req, file, cb) => {
        return cb(null, path.join(rootDir, 'images'))                                                               //destination is 'images' folder in the server directory
    },
    filename: (req, file, cb) => {
        const uniqueName = uniqueNameUtil.returnUniqueName(indexListController.currIndexList(), file.originalname)  //making sure files with same filename dont exist! 

        return cb(null, uniqueName)                                                                                 //how the file will be saved as
    }
})

const singleUpload = multer({storage: singleStorage})

exports.multerMiddleware = singleUpload.single('image')