const path = require('path')

module.exports = path.dirname(require.main.filename) //this is how we get root folder path (might be useful when using path.join())