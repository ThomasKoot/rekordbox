const fs = require("fs")
const R = require('rambda');
const requestAccessToken = require('./request_access_token.js');
const { log, Either, chain } = require("./either.js")

const tokenPath = './token.json'

// parseLocalToken :: path -> Either(error, token)
const parseLocalToken = R.pipe(
    Either.fromTryCatch(fs.readFileSync),
    chain(Either.fromTryCatch(JSON.parse)),
    chain(Either.fromPredicate(
            R.pipe(
                R.propOr(0, "expiryTime"), 
                x => x > Date.now()
            )
        )
    )
)

// getOrReuseToken :: -> ({clientId, clientSecret}) -> (reject, resolve) -> error, token
const getOrReuseToken = authData => (resolve, reject) => {

    const happyPath = 
        R.pipe(
            log("token has been reused"),
            R.prop('token'),
            resolve
        )

    const sadPath = 
        () => requestAccessToken(authData)
            .then(R.prop('access_token'))
            .then(log("writing new token to disk"))
            .then(writeTokenToDisk)
            .then(resolve)
            .catch(reject)

    parseLocalToken(tokenPath).fold(sadPath, happyPath)
}

// writeTokenToDisk :: -> token => Promise(token, err)
function writeTokenToDisk(token) {
    return new Promise((resolve, reject) => {
        const now = Date.now()
        const expiryTime = now + 1000 * 3600;
        fs.writeFile(
            tokenPath, 
            JSON.stringify({expiryTime, token}), 
            (err, _) => { err ? reject(err) : resolve(token) }
        );
    })
}

// getToken :: -> ({clientId, clientSecret}) => Promise(token, error)
function getToken(authData) {
    return new Promise(getOrReuseToken(authData))
}

module.exports = getToken