const R = require("rambda");
const addReleaseDate = require('./add_release_date');
const { writeFile } = require('fs/promises');
const getToken = require('./get_token');
const { checkValidity, readXml } = require("./convert_collection_util");

const trackPath = ['DJ_PLAYLISTS', 'COLLECTION', 0, 'TRACK']

// reads a rekordbox library from the specified path, when a track does not have a release date, or the release date is 0, it fetches the releasedate from the spotify API using the supplied credentials. Writes all tracks (both updated and not-updated) to the speficied destination path. It refrains from fetching a release date when there is no Artist field. On error, the release date is set to 0. 

async function convertCollection(config) {

    const { authData, libraryPath, destinationPath, iterationSize, timer } = config
    
    const [library, token] = await Promise.all(
        [
            readXml(libraryPath), 
            getToken(authData)
        ]
    )

    const tracks = R.view(R.lensPath(trackPath), library)
        
    async function iteration(tracks, completed = []) {
        await new Promise(r => setTimeout(r, timer)) 

        const partition = tracks.slice(0, iterationSize)
            .map(
                R.when(
                    R.complement(checkValidity), //checks if the release date needs updating
                    addReleaseDate(token)
                    )
                )

        const allPromises = await Promise.allSettled(partition)
        const result = allPromises.map(e => e.value)

        return result.length < iterationSize ?
            completed.concat(result) :
            iteration(tracks.slice(iterationSize), completed.concat(result))
    }
        
    const result = await iteration(tracks)
    const write = await writeFile(destinationPath, JSON.stringify(result, null, 2))

    return `finished, wrote ${tracks.length} tracks to ${destinationPath}`
}

module.exports = convertCollection