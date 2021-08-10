const R = require('rambda');
const { Either, chain, fold, map } = require('./either')

// parseJsonResponse asynchronously parses a JSON response and passes the result to the resolve callback. Rejects on error. 
const parseJsonResponse = (reject, resolve) => res => {
    let response = ""
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        response = response + chunk
    });
    res.on('end', () => {
        try {
            const result = JSON.parse(response);
            resolve(result)
        } catch(err) {
            reject(err)
        }
    });
}

// statusCodeValidator :: statusCode -> res -> Either({err<String>, res}, res)
const statusCodeValidator = statusCode => Either.validate(
    R.pipe(
        R.prop('statusCode'), 
        R.equals(statusCode)
    ),
    res => ({
        err: `invalid statusCode, expected ${statusCode}, recieved statusCode ${res.statusCode}`,
        arg: res
    })
)

// contentTypeValidator :: contentType<String> -> res -> Either({err<String>, res}, res)
const contentTypeValidator = contentType => Either.validate(
    R.pipe(
        R.view(R.lensPath(['headers', 'content-type'])), 
        R.startsWith(contentType)
    ),
    res => ({
        err: `invalid content-type, expected ${contentType}, recieved ${res.headers['content-type']}`,
        arg: res
    })
)

// validates and parses a response object. Passes the parsed Object to resolve, rejects on error.
const handleJsonResponse = (reject, resolve) => {
    return R.pipe(Either.of,
        chain(statusCodeValidator(200)),
        chain(contentTypeValidator('application/json')),
        fold(
            ({ err, arg: res }) => {
                res.resume();
                reject(err)
            },
            parseJsonResponse(reject, resolve)
        )
    )
}


module.exports = {
    parseJsonResponse,
    statusCodeValidator,
    contentTypeValidator,
    handleJsonResponse
}