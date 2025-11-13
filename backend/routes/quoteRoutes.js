// routes/quoteRoutes.js
import express from 'express'
import { getQuote } from '../controllers/quoteController.js'

const router = express.Router()

/**
 * @route   GET /api/quote?symbol=RELIANCE.BSE
 * @desc    Fetch latest stock quote (BSE) from Alpha Vantage
 * @access  Public
 *
 * NOTE:
 *  Alpha Vantage daily time series supports BSE symbols like:
 *  - RELIANCE.BSE
 *  - TCS.BSE
 *  - INFY.BSE
 */
router.get('/', getQuote)

export default router
