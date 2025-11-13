// backend/models/priceHistoryModel.js
import mongoose from 'mongoose'

const pricePoint = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  price: { type: Number, required: true }
}, { _id: false })

const PriceHistorySchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
  history: { type: [pricePoint], default: [] },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('PriceHistory', PriceHistorySchema)
