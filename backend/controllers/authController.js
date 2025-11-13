import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { updateDailyPrice } from './priceHistoryController.js'

/** Generate JWT token */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

/** @desc Register new user */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'User already exists. Please login instead.' })
    }

    const user = await User.create({ name, email, password })

    const token = generateToken(user._id)
    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

/** @desc Login user */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password.' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const token = generateToken(user._id)
    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
    setTimeout(async () => {
  try {
    const rows = await Portfolio.find({ user: user._id }).lean()
    const symbols = [...new Set(rows.map(r => r.symbol).filter(Boolean))]
    for (const s of symbols) await updateDailyPrice(s)
    console.log('[login-fallback] updated symbols for user', user._id)
  } catch (e) {
    console.warn('[login-fallback] error', e.message)
  }
}, 100)
  } catch (err) {
    next(err)
  }
}

/** @desc Get current user profile */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })
  } catch (err) {
    next(err)
  }
}
