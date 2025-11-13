import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, XCircle, Edit3 } from 'lucide-react'

const usd = (amount) =>
  typeof amount === 'number' && !isNaN(amount)
    ? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : '—'

export default function PortfolioTable({ items, onEdit, onDelete }) {
  if (!items?.length)
    return (
      <div className="p-10 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-900/20 shadow-inner">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-1 flex items-center justify-center gap-2">
          <XCircle size={20} className="text-gray-500" />
          No Stocks Added
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Start tracking your US stocks using the{" "}
          <span className="font-semibold text-indigo-600">Add Stock</span>{" "}
          button.
        </p>
      </div>
    )

  return (
    <div className="overflow-x-auto rounded-xl shadow-md bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        {/* Header */}
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900/40 text-gray-600 dark:text-gray-300 uppercase text-xs font-bold sticky top-0 z-10 shadow">
          <tr>
            <th className="px-4 py-3 text-left tracking-wide">Symbol</th>
            <th className="px-4 py-3 text-left tracking-wide">Buy Price</th>
            <th className="px-4 py-3 text-left tracking-wide">Qty</th>
            <th className="px-4 py-3 text-left tracking-wide">Current</th>
            <th className="px-4 py-3 text-left tracking-wide">P/L</th>
            <th className="px-4 py-3 text-right tracking-wide">Actions</th>
          </tr>
        </thead>

        <AnimatePresence initial={false}>
          <tbody>
            {items.map((item, index) => {
              const key = item._id || item.id || `${item.symbol}-${index}`

              const live =
                typeof item.currentPrice === 'number' &&
                !Number.isNaN(item.currentPrice)

              const pl = live
                ? (item.currentPrice - item.buyPrice) * item.quantity
                : 0

              const isProfit = pl > 0
              const isLoss = pl < 0

              return (
                <motion.tr
                  key={key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-b border-gray-100 dark:border-gray-700 
                             hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 
                             transition-colors"
                >
                  {/* Symbol */}
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-lg text-xs font-bold shadow-sm">
                      {item.symbol}
                    </span>
                  </td>

                  {/* Buy Price */}
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {usd(item.buyPrice)}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">
                    {item.quantity}
                  </td>

                  {/* Current Price */}
                  <td
                    className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100"
                    title={`Open: ${item.open ?? '-'}  |  High: ${
                      item.high ?? '-'
                    }  |  Low: ${item.low ?? '-'}`}
                  >
                    {live ? usd(item.currentPrice) : '—'}
                  </td>

                  {/* P/L */}
                  <td className="px-4 py-3">
                    {live ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold text-xs shadow-sm ${
                          isProfit
                            ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40'
                            : isLoss
                            ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40'
                            : 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'
                        }`}
                      >
                        {isProfit && <TrendingUp size={14} />}
                        {isLoss && <TrendingDown size={14} />}
                        {isProfit ? '+' : ''}
                        {usd(Number(pl.toFixed(2)))}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                      <Edit3 size={14} /> Edit
                    </button>

                    <button
                      onClick={() => onDelete(item._id || item.id)}
                      className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:underline hover:text-red-700 dark:hover:text-red-300"
                    >
                      ✖ Delete
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </AnimatePresence>
      </table>
    </div>
  )
}
