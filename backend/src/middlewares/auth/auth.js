import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { Staff } from '../../models/staffModel.js'
import AppError from '../../utils/appError.js'

const isAuthenticated = async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(
            new AppError(
                `You don't have permission to access this route.`,
                403,
            ),
        )
    }

    // Take role from payload
    console.log(token)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    if (decoded.id === 'admin') {
        return next()
    }

    const freshStaff = await Staff.findById(decoded.id)
    if (!freshStaff) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401,
            ),
        )
    }
    req.staff = await Staff.findById(decoded.id)

    next()
}

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return next(
            new AppError(
                `You don't have permission to access this route.`,
                403,
            ),
        )
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' })
        // req.user = decoded.UserInfo.username
        // req.roles = decoded.UserInfo.roles
        next()
    })
}

export { isAuthenticated, verifyJWT }
