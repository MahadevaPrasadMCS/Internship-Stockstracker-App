// server.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import connectDB from './config/db.js'

import quoteRoutes from './routes/quoteRoutes.js'
import authRoutes from './routes/authRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'
import priceHistoryRoutes from './routes/priceHistoryRoutes.js'
import { startDailyPriceCron } from './jobs/dailyPriceJob.js'

import errorHandler from './middleware/errorHandler.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

// Connect to MongoDB
connectDB(process.env.MONGO_URI)

const app = express()

/** -------------------------
 *  Global Middlewares
 *  ------------------------- */
app.use(helmet()) // adds security headers
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
)

startDailyPriceCron() // Start the daily price fetching job

app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

/** -------------------------
 *  API Routes
 *  ------------------------- */

// Fetch stock price
app.use('/api/quote', quoteRoutes)

// Auth: register, login, profile
app.use('/api/auth', authRoutes)

// Portfolio CRUD (protected)
app.use('/api/portfolio', portfolioRoutes)

// Price History
app.use('/api/price-history', priceHistoryRoutes)

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
})

/** -------------------------
 *  Error Handler (MUST BE LAST)
 *  ------------------------- */
app.use(errorHandler)

/** -------------------------
 *  Start Server
 *  ------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`)
  console.log(`🌐 CORS allowed: ${FRONTEND_ORIGIN}`)
})
