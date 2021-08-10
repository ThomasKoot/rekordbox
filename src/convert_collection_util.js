const R = require("rambda");
const xml2js = require('xml2js');
const { readFile } = require("fs/promises")

const propValidator = (prop, pred) => obj => {
    return pred(R.view(R.lensPath(["$", prop]), obj))
}
    
const checkValidity = R.allPass([
    propValidator("Year", x => x != null && x !== "0"),
    propValidator("Artist", x => x != null && x !== "")
])
        
const readXml = path => {
    return readFile(path, {encoding: 'utf-8'})
            .then(xml2js.parseStringPromise)
}

module.exports = {
    checkValidity,
    readXml
}