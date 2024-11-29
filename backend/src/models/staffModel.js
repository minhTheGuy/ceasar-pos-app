import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import crypto from 'crypto'

const accountSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false,
        },
    },
    { _id: false },
)

const staffSchema = mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, 'Fullname is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, 'Email already exists'],
            lowercase: [true, 'Email must be in lowercase'],
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        avatar: {
            type: String,
            required: [true, 'Avatar is required'],
        },
        account: accountSchema,
        status: {
            type: String,
            required: [true, 'Status is required'],
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
        is_locked: {
            type: String,
            required: [true, 'is_locked is required'],
            enum: ['True', 'False'],
            default: 'False',
        },
        never_login: {
            type: Boolean,
            default: true,
        },
        loginToken: String,
        loginTokenExpires: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    { timestamps: true },
)

staffSchema.pre('save', function (next) {
    if (this.isModified('account.password')) {
        this.account.password = bcrypt.hashSync(this.account.password, 12)
    }
    next()
})

staffSchema.methods.comparePassword = async (enteredPassword, userPassword) => {
    // console.log(enteredPassword, userPassword)
    return await bcrypt.compare(enteredPassword, userPassword)
}

staffSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    console.log(
        { resetToken },
        this.passwordResetToken,
        this.passwordResetExpires,
    )
    return resetToken
}

staffSchema.methods.jwtToken = function () {
    const user = this
    const role = this.account.username === 'admin' ? 'admin' : 'staff'
    return jwt.sign(
        {
            id: user._id,
            role: role,
            username: user.account.username,
            email: user.email,
            fullname: user.fullname,
            is_locked: user.is_locked,
            never_login: user.never_login,
            loginToken: user?.loginToken,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        },
    )
}

staffSchema.methods.createLoginToken = function () {
    const randomToken = crypto.randomBytes(32).toString('hex')
    this.loginToken = crypto
        .createHash('sha256')
        .update(randomToken)
        .digest('hex')

    this.loginTokenExpires = Date.now() + 60 * 1000

    return this.loginToken
}

const Staff = mongoose.model('Staff', staffSchema)

export { Staff }
