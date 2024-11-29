import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

import { Customer } from '../models/customerModel.js'

const getCustomers = catchAsync(async (req, res, next) => {
    const customers = await Customer.find().sort({ createdAt: -1 })

    // Filter customers by phone number
    const { phone, fullname } = req.query
    if (phone) {
        const customer = customers.filter((customer) => {
            return customer.phone === phone
        })
        if (customer.length === 0) {
            return res.status(200).json({
                status: 'success',
                msg: 'No customer found with that phone number',
            })
        }

        return res.status(200).json({
            status: 'success',
            data: customer,
        })
    }

    if (fullname) {
        const customers = await Customer.find({
            fullname: { $regex: fullname, $options: 'i' },
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            status: 'success',
            results: customers.length,
            data: customers,
        })
    }

    res.status(200).json({
        status: 'success',
        results: customers.length,
        data: customers,
    })
})

const getCustomerById = catchAsync(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id)

    if (!customer) {
        return next(new AppError('No customer found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: customer,
    })
})

const createCustomer = catchAsync(async (req, res, next) => {
    const newCustomer = await Customer.create(req.body)

    res.status(201).json({
        status: 'success',
        data: newCustomer,
    })
})

const updateCustomer = catchAsync(async (req, res, next) => {
    const editCustomer = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        },
    )

    if (!customer) {
        return next(new AppError('No customer found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: editCustomer,
    })
})
const deleteCustomer = catchAsync(async (req, res, next) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)

    if (!customer) {
        return next(new AppError('No customer found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: customer,
    })
})

export {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
}
