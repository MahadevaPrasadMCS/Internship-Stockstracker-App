// config/db.js
import mongoose from 'mongoose'

const connectDB = async (mongoUri) => {
  try {
    if (!mongoUri) throw new Error('MONGO_URI is missing from environment variables.')

    // Modern Mongoose connection (no extra options needed)
    const conn = await mongoose.connect(mongoUri)

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
