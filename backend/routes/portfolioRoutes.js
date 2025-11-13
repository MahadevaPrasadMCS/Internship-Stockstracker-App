// routes/portfolioRoutes.js
import express from 'express'
import {
  getPortfolio,
  addStock,
  updateStock,
  deleteStock,
} from '../controllers/portfolioController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// 🔐 All routes below require valid JWT
router.use(protect)

/**
 * @route   GET /api/portfolio
 * @desc    Get all portfolio stocks for logged-in user
 * @access  Private
 */
router.get('/', getPortfolio)

/**
 * @route   POST /api/portfolio
 * @desc    Add a new stock to portfolio
 * @access  Private
 */
router.post('/', addStock)

/**
 * @route   PUT /api/portfolio/:id
 * @desc    Update a stock entry by ID
 * @access  Private
 */
router.put('/:id', updateStock)

/**
 * @route   DELETE /api/portfolio/:id
 * @desc    Delete a stock entry by ID
 * @access  Private
 */
router.delete('/:id', deleteStock)

export default router
