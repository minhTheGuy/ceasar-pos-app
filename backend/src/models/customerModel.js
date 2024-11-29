import mongoose from 'mongoose'

const customerSchema = mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, 'Full name is required'],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
        },
    },
    { timestamps: true },
)

const Customer = mongoose.model('Customer', customerSchema)

export { Customer }
