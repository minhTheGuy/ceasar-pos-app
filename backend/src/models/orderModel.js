// Change OrderModel.js to orderModel.js

import { mongoose, Schema } from 'mongoose'

const itemsSchema = mongoose.Schema(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            required: [true, 'Product ID is required'],
            ref: 'Product',
        },
        name: {
            type: String,
            required: [true, 'Product name is required'],
        },
        retail_price: {
            type: String,
            required: [true, 'Retail price is required'],
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
        },
        subTotal: {
            type: String,
            required: [true, 'SubTotal is required'],
        },
    },
    { _id: false },
)

const orderSchema = mongoose.Schema(
    {
        staff_id: {
            type: Schema.Types.ObjectId,
            required: [true, 'Staff ID is required'],
            ref: 'Staff',
        },
        customer_id: {
            type: Schema.Types.ObjectId,
            required: [true, 'Customer ID is required'],
            ref: 'Customer',
        },
        totalAmount: {
            type: String,
            required: [true, 'Total amount is required'],
        },
        receivedAmount: {
            type: String,
            required: [true, 'Received amount is required'],
        },
        change: {
            type: String,
            required: [true, 'Change is required'],
        },
        items: [itemsSchema],
    },
    { timestamps: true },
)

const Order = mongoose.model('Order', orderSchema)

export { Order }
