import app from './app.js'
import { connectDB } from './src/config/database.js'

const PORT = process.env.PORT || 8080

connectDB()

const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`)
})

process.on('unhandledRejection', (err) => {
    console.log('UHANDLED REJECTION ERROR! Shutting down...')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION ERROR! Shutting down...')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})
