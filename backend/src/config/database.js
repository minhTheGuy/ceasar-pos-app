import mongoose from 'mongoose'

const MONGODB_URI =
    process.env.MONGO_URI || `mongodb://localhost/phone-store-pos`

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI, {})
        console.log(
            `MongoDB connected: ${conn.connection.host}, ${conn.connection.name}, ${conn.connection.port}`,
        )
    } catch (err) {
        console.error(err)
    }
}

export { connectDB }
