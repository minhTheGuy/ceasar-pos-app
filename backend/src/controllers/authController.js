import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

import { Staff } from '../models/staffModel.js'
import sendEmail from '../utils/email.js'

const login = catchAsync(async (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        return next(new AppError('Please provide email and password!', 400))
    }

    const staff = await Staff.findOne({ 'account.username': username }).select(
        '+account.password',
    )
    if (
        !staff ||
        !(await staff.comparePassword(password, staff.account.password))
    ) {
        return next(new AppError('Incorrect username or password', 401))
    }

    if (staff.loginToken && !req.query.token) {
        return next(new AppError('You need to use login token to login', 401))
    }

    if (staff.loginToken && req.query.token !== staff.loginToken) {
        return next(new AppError('Login token is wrong', 401))
    }

    if (staff.loginTokenExpires && staff.loginTokenExpires < Date.now()) {
        return next(new AppError('Login token is expired', 401))
    }

    if (staff.is_locked === 'True') {
        return next(new AppError('Account is locked', 401))
    }

    staff.loginToken = undefined
    staff.loginTokenExpires = undefined
    await staff.save({ validateBeforeSave: false })

    const token = staff.jwtToken()
    staff.account.password = undefined
    const role = staff.account.username === 'admin' ? 'admin' : 'staff'

    res.status(200).json({
        status: 'success',
        token,
    })
})

const logout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content

    res.clearCookie('jwt')
    res.json({ message: 'Cookie cleared' })
}

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'staff'])
        if (!roles.includes(req.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403,
                ),
            )
        }
        next()
    }
}

const forgotPassword = catchAsync(async (req, res, next) => {
    const staff = await Staff.findOne({ email: req.body.email })

    if (!staff) {
        return next(new AppError('There is no user with email address.', 404))
    }

    const resetToken = staff.createPasswordResetToken()
    await staff.save({ validateBeforeSave: false })

    const resetURL = `${req.protocol}://${req.get(
        'host',
    )}/api/v1/auth/resetPassword/${resetToken}`
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

    try {
        sendEmail({
            email: staff.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        })

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        })
    } catch (err) {
        staff.passwordResetToken = undefined
        staff.passwordResetExpires = undefined
        await staff.save({ validateBeforeSave: false })

        return next(
            new AppError(
                'There was an error sending the email. Try again later!',
            ),
            500,
        )
    }
})

const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const staff = await Staff.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })

    if (!staff) {
        return next(new AppError('Token is invalid or has expired', 400))
    }

    staff.account.password = req.body.password
    staff.passwordResetToken = undefined
    staff.passwordResetExpires = undefined
    await staff.save()

    const token = staff.jwtToken()
    staff.account.password = undefined

    res.status(200).json({
        status: 'success',
        token,
    })
})

const updatePassword = catchAsync(async (req, res, next) => {
    const staff = await Staff.findById(req.params.id).select(
        '+account.password',
    )

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new AppError('Passwords are not the same', 400))
    }

    staff.account.password = req.body.newPassword
    staff.never_login = false
    await staff.save()

    const token = staff.jwtToken()
    staff.account.password = undefined

    res.status(200).json({
        status: 'success',
        token,
    })
})

const resendLoginEmail = catchAsync(async (req, res, next) => {
    const staff = await Staff.findOne({ email: req.body.email }).select(
        '+account.password',
    )

    if (!staff) {
        return next(new AppError('There is no user with email address.', 404))
    }

    const loginToken = staff.createLoginToken()
    await staff.save({ validateBeforeSave: false })

    const url = `${process.env.FE_URL}/?token=${loginToken}`
    const message = `Your account has been created. Your username is ${staff.account.username}.\nPlease login to ${url} to change your password. (This link is valid for 1 minutes)`
    try {
        sendEmail({
            email: staff.email,
            subject: 'Account created',
            message,
        })

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        })
    } catch (err) {
        staff.loginToken = undefined
        staff.loginTokenExpires = undefined
        await staff.save({ validateBeforeSave: false })

        return next(
            new AppError(
                'There was an error sending the email. Try again later!',
            ),
            500,
        )
    }
})

export {
    login,
    logout,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
    resendLoginEmail,
}
