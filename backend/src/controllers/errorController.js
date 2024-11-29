import fs from 'fs'
import AppError from '../utils/appError.js'

const handleCastErrorDB = (err, res) => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err, res) => {
    const value = err.errmsg.match(/(["'])(\\?.)*\1/)
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (err, res) => {
    const errors = Object.values(err.errors).map((el) => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}

const handleJWTError = (err) =>
    new AppError('Invalid token. Please log in again!', 401)

const handleJWTExpiredError = (err) =>
    new AppError('Your token has expired!', 401)

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
    })
}

const sendErrorProd = (err, res) => {
    // If isOperational, send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }
    // If not, don't leak error details
    else {
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        })
    }
}

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    if (req.file) {
        if (req.file.filename.includes('avatar')) {
            fs.unlink(`public/uploads/avatars/${req.file.filename}`, (err) => {
                if (err) {
                    console.error(err)
                }
            })
        }
    }
    console.log(err)
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        if (error.name === 'CastError') error = handleCastErrorDB(error, res)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error, res)
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error, res)
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error)
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError(error)

        sendErrorProd(error, res)
    }
}
