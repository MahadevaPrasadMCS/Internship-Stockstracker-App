// backend/utils/marketstackClient.js
import axios from 'axios'

export async function fetchMarketStackPrice(symbol) {
  try {
    const apiKey = process.env.MARKETSTACK_API_KEY
    if (!apiKey) throw new Error('MARKETSTACK_API_KEY not set')

    // latest EOD: use your earlier used endpoint
    const url = `http://api.marketstack.com/v1/eod/latest?access_key=${apiKey}&symbols=${encodeURIComponent(symbol)}`
    const { data } = await axios.get(url)

    if (!data || !data.data || data.data.length === 0) {
      return null
    }
    const stock = data.data[0]
    return {
      date: stock.date,
      close: Number(stock.close),
      open: Number(stock.open),
      high: Number(stock.high),
      low: Number(stock.low)
    }
  } catch (err) {
    console.error('fetchMarketStackPrice error', err.message)
    throw err
  }
}
