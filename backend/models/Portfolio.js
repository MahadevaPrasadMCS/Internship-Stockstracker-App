// models/Portfolio.js
import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9.]+$/, 'Invalid stock symbol format'],   // ensures RELIANCE.BSE or TCS
    },

    buyPrice: {
      type: Number,
      required: [true, 'Buy price is required'],
      min: [0, 'Buy price cannot be negative'],
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
)

// Improve performance on large portfolios
portfolioSchema.index({ user: 1 })
portfolioSchema.index({ user: 1, symbol: 1 })

export default mongoose.model('Portfolio', portfolioSchema)
