const Right = val => ({
    map: fn => Right(fn(val)),
    chain: fn => fn(val),
    fold: (_, right) => right(val)
})

const Left = val => ({
    map: fn => Left(val),
    chain: fn => Left(val),
    fold: (left, _) => left(val)
})

const chain = fn => monad => monad.chain(fn)
const fold = (left, right) => functor => functor.fold(left, right)
const map = fn => functor => functor.map(fn)

const fromNullable = fn => arg => {
    const result = fn(arg)
    return result != null ?
        Right(result) :
        Left(undefined)
}

const fromPredicate = fn => arg => {
    return fn(arg) === true ?
        Right(arg) :
        Left(arg)
}

const validate = (validator, messageConstructor) => arg => {
    return validator(arg) === true ?
        Right(arg) :
        Left(messageConstructor(arg))
}

const fromTryCatch = fn => arg => {
    try {
        return Right(fn(arg))
    } catch (e) {
        return Left(e)
    }
}

const log = message => data => {
    console.log(message);
    return data
}

const logData = data => {
    console.log(data)
    return data
}

const Either = {
    of: val => Right(val), 
    fromNullable,
    fromPredicate,
    fromTryCatch,
    validate
}

module.exports = {
    log,
    logData,
    Either,
    chain,
    fold,
    map
}