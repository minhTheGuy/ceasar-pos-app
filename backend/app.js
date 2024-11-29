import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import morgan from 'morgan'

import authRoute from './src/routes/authRoutes.js'
import customerRoute from './src/routes/customerRoutes.js'
import productRoute from './src/routes/productRoutes.js'
import staffRoute from './src/routes/staffRoutes.js'
import orderRoute from './src/routes/orderRoutes.js'

import AppError from './src/utils/appError.js'
import globalErrorHandler from './src/controllers/errorController.js'
import cookieParser from 'cookie-parser'
import path from 'path'
import { __dirname } from './src/utils/fileUtils.js'

configDotenv({ path: './config.env' })

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
)
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'))

// Routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/customers', customerRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/staffs', staffRoute)
app.use('/api/v1/orders', orderRoute)

// Error Handling
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

// Global Error Handling Middleware
app.use(globalErrorHandler)

export default app
