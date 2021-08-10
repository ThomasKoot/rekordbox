const https = require("https")
const { handleJsonResponse } = require("./http_helpers.js");

const getTrackInfo = token => track => {

    return new Promise((resolve, reject) => {
        
        const endpoint = 'api.spotify.com'
        const queryParams = encodeURI(`q=${track.Name} ${track.Artist}&type=track&limit=1`)

        const path = `/v1/search/?${queryParams}`

        const options = {
            hostname: endpoint,
            path,
            headers: {
                "Authorization" : "Bearer " + token
            }
        };      
        
        const req = https.get(
            options, 
            handleJsonResponse(reject, resolve)
        )
        req.on("error", reject)
    })
}

module.exports = getTrackInfo