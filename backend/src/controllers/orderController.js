import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import { Order } from '../models/orderModel.js'
import { Staff } from '../models/staffModel.js'
import { Customer } from '../models/customerModel.js'

const getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find()

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: orders,
    })
})

const getOrderById = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new AppError('No order found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: order,
    })
})

const getOrdersByCustomerId = catchAsync(async (req, res, next) => {
    const { id } = req.params

    try {
        const orders = await Order.find({ customer_id: id }).sort({
            createdAt: -1,
        })
        if (!orders) {
            return res
                .status(404)
                .json({ message: 'No orders found for this customer' })
        }
        res.status(200).json({ data: orders })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
})

const getOrderStatistics = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query
    try {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)

        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        const orders = await Order.find({
            createdAt: {
                $gte: start,
                $lte: end,
            },
        }).populate('customer_id', 'fullname')

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                orders: [],
                totalAmountOrders: 0,
                totalQuantityOrders: 0,
                totalOrders: 0,
            })
        }

        const totalAmountOrders = orders.reduce(
            (result, order) => result + parseFloat(order.totalAmount),
            0,
        )
        const totalQuantityOrders = orders.reduce(
            (result, order) =>
                result +
                order.items.reduce((sum, item) => sum + item.quantity, 0),
            0,
        )
        const totalOrders = orders.length

        res.status(200).json({
            orders,
            totalAmountOrders,
            totalQuantityOrders,
            totalOrders,
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
})

const getTotalAmountLast12Months = catchAsync(async (req, res) => {
    const now = new Date()
    const startYear = now.getFullYear() - 1
    const startMonth = now.getMonth() + 1
    const startDate = '01'
    const begin = new Date(`${startYear}-${startMonth}-${startDate}`)

    const orders = await Order.find({
        createdAt: {
            $gte: begin,
            $lte: now,
        },
    })

    const totalAmountByMonth = Array(13).fill(0)
    const months = []

    for (let i = 0; i <= 12; i++) {
        const date = new Date(
            begin.getFullYear(),
            begin.getMonth() + i,
            begin.getDate(),
        )
        const month = date.getMonth() + 1
        const year = date.getFullYear().toString().slice(-2)
        months.push(`${month}/${year}`)
    }

    orders.forEach((order) => {
        const month = order.createdAt.getMonth()
        const year = order.createdAt.getFullYear()
        const index =
            (year - begin.getFullYear()) * 12 + month - begin.getMonth()
        if (index >= 0 && index <= 12) {
            totalAmountByMonth[index] += parseFloat(order.totalAmount)
        }
    })

    res.status(200).json({
        totalAmountByMonth,
        months,
    })
})

const getTotalProductLast12Months = catchAsync(async (req, res) => {
    const now = new Date()
    const startYear = now.getFullYear() - 1
    const startMonth = now.getMonth() + 1
    const startDate = '01'
    const begin = new Date(`${startYear}-${startMonth}-${startDate}`)

    const orders = await Order.find({
        createdAt: {
            $gte: begin,
            $lte: now,
        },
    })

    const totalProductByMonth = Array(13).fill(0)
    const months = []

    for (let i = 0; i <= 12; i++) {
        const date = new Date(
            begin.getFullYear(),
            begin.getMonth() + i,
            begin.getDate(),
        )
        const month = date.getMonth() + 1
        const year = date.getFullYear().toString().slice(-2)
        months.push(`${month}/${year}`)
    }

    orders.forEach((order) => {
        const month = order.createdAt.getMonth()
        const year = order.createdAt.getFullYear()
        const index =
            (year - begin.getFullYear()) * 12 + month - begin.getMonth()
        if (index >= 0 && index <= 12) {
            totalProductByMonth[index] += order.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
            )
        }
    })

    res.status(200).json({
        totalProductByMonth,
        months,
    })
})

const createOrder = catchAsync(async (req, res, next) => {
    const newOrder = await Order.create(req.body)

    res.status(201).json({
        status: 'success',
        data: newOrder,
    })
})

const getOverallStatistics = catchAsync(async (req, res) => {
    try {
        const totalStaff = await Staff.countDocuments()
        const totalOrders = await Order.countDocuments()
        const totalCustomers = await Customer.countDocuments()
        const orders = await Order.find()
        const totalAmount = orders.reduce(
            (result, order) => result + parseFloat(order.totalAmount),
            0,
        )
        const totalProductsSold = orders.reduce((result, order) => {
            order.items.forEach((item) => {
                result += item.quantity
            })
            return result
        }, 0)

        res.status(200).json({
            totalCustomers,
            totalStaff,
            totalOrders,
            totalAmount,
            totalProductsSold,
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error })
    }
})

const updateOrder = catchAsync(async (req, res, next) => {
    const editOrder = await Order.findByIdAndUpdate

    if (!editOrder) {
        return next(new AppError('No order found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: editOrder,
    })
})

const deleteOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order) {
        return next(new AppError('No order found with that ID', 404))
    }

    res.status(204).json({
        status: 'success',
        data: order,
    })
})

export {
    getAllOrders,
    getOrderById,
    getOrdersByCustomerId,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderStatistics,
    getTotalAmountLast12Months,
    getOverallStatistics,
    getTotalProductLast12Months,
}
