// backend/jobs/dailyPriceJob.js
import cron from 'node-cron'
import Portfolio from '../models/Portfolio.js'
import { updateDailyPrice } from '../controllers/priceHistoryController.js'

export function startDailyPriceCron() {
  // Runs every weekday at 06:10 UTC (adjust to your timezone if needed)
  cron.schedule('10 6 * * MON-FRI', async () => {
    try {
      console.log('[cron] Starting daily price update...')
      const rows = await Portfolio.find().lean()
      const symbols = [...new Set(rows.map(r => r.symbol).filter(Boolean))]
      for (const s of symbols) {
        try {
          await updateDailyPrice(s)
          console.log('[cron] updated', s)
        } catch (err) {
          console.warn('[cron] failed for', s, err.message)
        }
      }
      console.log('[cron] Daily update completed')
    } catch (err) {
      console.error('[cron] job error', err)
    }
  })
}
