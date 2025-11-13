// backend/routes/priceHistoryRoutes.js
import express from 'express'
import { getHistory, updateAllFromPortfolio } from '../controllers/priceHistoryController.js'
const router = express.Router()

router.get('/history/:symbol', getHistory)          // public (or protected if desired)
router.post('/history/update-all', updateAllFromPortfolio) // protected? up to you

export default router
