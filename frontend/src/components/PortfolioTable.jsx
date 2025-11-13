import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, XCircle, Edit3 } from 'lucide-react'

export default function PortfolioTable({ items, onEdit, onDelete }) {
  if (!items?.length)
    return (
      <div className="p-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center bg-gray-50 dark:bg-gray-800/40 shadow-inner">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-1 flex items-center justify-center gap-2">
          <XCircle size={20} className="text-gray-500" />
          No Stocks Added
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Use the <span className="font-medium text-indigo-600">“Add Stock”</span> button to start tracking your portfolio.
        </p>
      </div>
    )

  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-gray-900/70 backdrop-blur-md border border-gray-100 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-4 py-3 text-left">Symbol</th>
            <th className="px-4 py-3 text-left">Buy Price (₹)</th>
            <th className="px-4 py-3 text-left">Qty</th>
            <th className="px-4 py-3 text-left">Current Price (₹)</th>
            <th className="px-4 py-3 text-left">P/L</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <AnimatePresence initial={false}>
          <tbody>
            {items.map(item => {
              const hasLive = typeof item.currentPrice === 'number'
              const pl = hasLive
                ? (item.currentPrice - item.buyPrice) * item.quantity
                : null

              return (
                <motion.tr
                  key={item._id || item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-200"
                >
                  {/* Symbol */}
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    {item.symbol}
                  </td>

                  {/* Buy Price */}
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                   ₹{Number(item.buyPrice ?? 0).toFixed(2)}
                  </td>

                  {/* Quantity */}
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {item.quantity}
                  </td>

                  {/* Current Price */}
                  <td
                    className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100"
                    title={`O:${item.open}  H:${item.high}  L:${item.low}`}
                  >
                    {hasLive ? `₹${Number(item.currentPrice ?? 0).toFixed(2)}` : '—'}
                  </td>

                  {/* P/L */}
                  <td className="px-4 py-3">
                    {hasLive ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          pl > 0
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : pl < 0
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {pl > 0 ? (
                          <TrendingUp size={14} />
                        ) : pl < 0 ? (
                          <TrendingDown size={14} />
                        ) : null}
                        {pl > 0 ? '+' : ''}
                        ₹{Number(pl ?? 0).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(item._id || item.id)}
                      className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:underline"
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
