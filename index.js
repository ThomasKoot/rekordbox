const authData = require('./.auth_data.json')
const convertCollection = require('./src/convert_collection');

convertCollection({
    authData,
    libraryPath: './rekordbox_library.xml',
    destinationPath: './tracks.json',
    iterationSize: 50,
    timer: 1000
})
.then(console.log)
.catch(console.log)



