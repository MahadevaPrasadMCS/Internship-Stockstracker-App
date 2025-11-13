// routes/authRoutes.js
import express from 'express'
import {
  registerUser,
  loginUser,
  getProfile,
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerUser)

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 * @access  Public
 */
router.post('/login', loginUser)

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user profile
 * @access  Private (JWT required)
 */
router.get('/profile', protect, getProfile)

export default router
