// backend/controllers/priceHistoryController.js
import PriceHistory from '../models/priceHistoryModel.js'
import { fetchMarketStackPrice } from '../utils/marketstackClient.js' // implement wrapper or reuse existing fetch
import Portfolio from '../models/Portfolio.js'

/**
 * Update today's price for single symbol (safe & idempotent).
 * Returns the updated document or null.
 */
export async function updateDailyPrice(symbol) {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  try {
    const live = await fetchMarketStackPrice(symbol) // should return { close, open, high, low, date }
    if (!live || typeof live.close !== 'number') return null

    const upsert = await PriceHistory.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      {
        $setOnInsert: { symbol: symbol.toUpperCase() },
        $set: { updatedAt: new Date() },
        $push: {
          history: {
            $each: [{ date: today, price: live.close }],
            $slice: -2000 // keep last N points to limit growth (adjust as needed)
          }
        }
      },
      { upsert: true, new: true }
    )

    // Ensure there is only one entry per date (de-dup)
    upsert.history = upsert.history.filter((v, idx, arr) =>
      idx === arr.findIndex(x => x.date === v.date)
    )
    await upsert.save()
    return upsert
  } catch (err) {
    console.error('updateDailyPrice error for', symbol, err.message)
    throw err
  }
}

/** API: GET /api/history/:symbol */
export const getHistory = async (req, res) => {
  try {
    const { symbol } = req.params
    if (!symbol) return res.status(400).json({ message: 'Symbol required' })

    const doc = await PriceHistory.findOne({ symbol: symbol.toUpperCase() })
    if (!doc) return res.json([])

    return res.json(doc.history)
  } catch (err) {
    console.error('getHistory error', err)
    return res.status(500).json({ message: 'Failed to fetch history' })
  }
}

/** Convenience: Update all symbols present in portfolio */
export const updateAllFromPortfolio = async (req, res) => {
  try {
    const rows = await Portfolio.find().lean()
    const symbols = [...new Set(rows.map(r => r.symbol).filter(Boolean))]
    const results = []
    for (const s of symbols) {
      try {
        const r = await updateDailyPrice(s)
        results.push({ symbol: s, ok: !!r })
      } catch (err) {
        results.push({ symbol: s, ok: false, error: err.message })
      }
    }
    return res.json({ results })
  } catch (err) {
    console.error('updateAllFromPortfolio error', err)
    return res.status(500).json({ message: 'Failed to update all' })
  }
}
