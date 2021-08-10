# rekordbox
an app to check a rekordbox collection for missing release dates, missing release dates are fetched from the spotify search API and inserted into a new tracklist. 

To run, the app needs a clientId and clientSecret from spotify, it assumes these are saved in ./auth_data.json. 
Access_tokens are valid for one hour and written to ./token.json. When you rerun the app, it checks if it can reuse the exitisting token, otherwise it fetches a new one using the supplied credentials. 

You can set the path to a rekordbox library in the index.js file. A dummy library is provided to test on. The tracks are written to JSON and can be further processed, the app does not update the existing library, but this can be easily done by converting the tracks back to XML.

Tracks are updated when they do not have a release date, or a release date of 0. If there is no Artist field, the track will not be updated. The app queries the spotify API with the artist and name and picks the release date of the first result. Text between curly braces in the name field is ommited (for example: (Original mix)).

When working with a large library, requests can be throttled because of api-rate-limiting. Therefore, requests are done in batches, you can set the batchSize in the index.js (iterationSize), and the time to wait between batches (timer, specified in milliseconds)

