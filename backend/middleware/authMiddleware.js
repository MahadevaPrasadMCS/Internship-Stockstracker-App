import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/** @desc Protect routes - verify JWT token and attach user to request */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // No token provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing.' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Invalid token payload.' })
    }

    // Fetch user without password
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User not found or token no longer valid.' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error.message)

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' })
    }

    res.status(401).json({ message: 'Invalid or unauthorized token.' })
  }
}
