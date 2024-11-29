import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import { Product } from '../models/productModel.js'

const getProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 })

    const { name, barcode } = req.query

    if (name && barcode) {
        const filteredProducts = products.filter((product) => {
            return (
                product.name.toLowerCase().includes(name.toLowerCase()) &&
                product.barcode.toLowerCase().includes(barcode.toLowerCase())
            )
        })
        return res.status(200).json({
            status: 'success',
            results: filteredProducts.length,
            data: filteredProducts,
        })
    }

    if (name) {
        const filteredProducts = products.filter((product) => {
            return product.name.toLowerCase().includes(name.toLowerCase())
        })
        return res.status(200).json({
            status: 'success',
            results: filteredProducts.length,
            data: filteredProducts,
        })
    }

    if (barcode) {
        const filteredProducts = products.filter((product) => {
            return product.barcode.toLowerCase().includes(barcode.toLowerCase())
        })
        return res.status(200).json({
            status: 'success',
            results: filteredProducts.length,
            data: filteredProducts,
        })
    }

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: products,
    })
})

const getProductById = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const product = await Product.findById(id)
    if (!product) {
        res.json({ status: 'fail', message: 'Product not found' })
    }
    res.json(product)
})

const createProduct = catchAsync(async (req, res, next) => {
    const savedProduct = await Product.create(req.body)
    res.json(savedProduct)
})

const updateProduct = catchAsync(async (req, res, next) => {
    const id = req.params.id
    const result = await Product.findByIdAndUpdate(id, req.body)
    res.json({ message: 'Product updated successfully' })
})

const deleteProduct = catchAsync(async (req, res) => {
    const id = req.params.id
    const result = await Product.findByIdAndDelete(id)

    if (!result) {
        return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
})

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
}
