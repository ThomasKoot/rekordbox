const R = require('rambda');
const { log, logData, Either, map, fold } = require('./either');
const fetchReleaseDate = require('./fetch_release_date')

const releaseDatePath = ["tracks", "items", 0, "album", "release_date"]
const propPath = path => obj => R.view(R.lensPath(path), obj)

// parseReleaseDate :: spotifyResponse<Object> -> releaseDate<String>
const parseReleaseDate = R.pipe(
    Either.fromNullable(propPath(releaseDatePath)),
    map(R.split("-")),
    map(R.nth(0)),
    fold(
        _ => "0",
        R.identity
    )
)

// addReleaseDate :: token -> track -> Promise
const addReleaseDate = token => {
    
    const fetchReleaseDateAutheticated = fetchReleaseDate(token)

    return function(track) {

        console.log(`fetching date for ${track["$"].Name} by ${track["$"].Artist}`)
        
        const handleData = R.pipe(
            parseReleaseDate,
            R.when(R.equals("0"), log(`could not find date for ${track["$"].Name} by ${track["$"].Artist}`)),
            x => R.set(R.lensPath(["$", "Year"]), x, track)
        )   
        
        const handleError = R.pipe(
            log("an error occurred"),
            logData,
            _ => track
        )

        return fetchReleaseDateAutheticated({
                Artist: track["$"].Artist,
                Name: track["$"].Name.replace(/\(.+\)/, "")
            }).then(handleData).catch(handleError)
    }
}

module.exports = addReleaseDate;