const https = require("https");
const { handleJsonResponse } = require("./http_helpers");

function requestAccessToken({clientId, clientSecret}) {

    return new Promise((resolve, reject) => {
    
        const authString = clientId + ":" + clientSecret
        const authData = Buffer.from(authString).toString('base64')
        const xFormBody = encodeURI('grant_type=client_credentials')

        const options = {
            hostname: 'accounts.spotify.com',
            path: '/api/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(xFormBody),
                "Authorization" : "Basic " + authData
            }
        };

        const req = https.request(
            options, 
            handleJsonResponse(reject, resolve)
        )

        req.on('error', err => {
            reject(err);
        });

        req.write(xFormBody);
        req.end();
    })
}

module.exports = requestAccessToken