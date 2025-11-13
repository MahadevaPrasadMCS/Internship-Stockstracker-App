import React from 'react'
import { calculateSummary } from '../utils/calculatePL'
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react'

export default function SummaryWidget({ items }) {
  const { totalInvestment, totalCurrentValue, netPL, percent } = calculateSummary(items)

  const isProfit = netPL > 0
  const isLoss = netPL < 0

  return (
    <div className="bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-md shadow-md border border-gray-100 dark:border-gray-700 rounded-2xl p-6 transition-all">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        Portfolio Summary
      </h3>

      {/* Main Metrics */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Total Investment</span>
          <span className="font-medium flex items-center gap-1 text-gray-800 dark:text-gray-200">
            <IndianRupee size={14} /> {totalInvestment.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Current Value</span>
          <span className="font-medium flex items-center gap-1 text-gray-800 dark:text-gray-200">
            <IndianRupee size={14} /> {totalCurrentValue.toFixed(2)}
          </span>
        </div>

        {/* Net P/L */}
        <div
          className={`flex justify-between items-center mt-3 font-semibold ${
            isProfit
              ? 'text-emerald-600'
              : isLoss
              ? 'text-red-600'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <span>Net P/L</span>
          <div className="flex items-center gap-1">
            {isProfit && <TrendingUp size={16} />}
            {isLoss && <TrendingDown size={16} />}
            <span>
              {netPL >= 0 ? '+' : ''}
              ₹{netPL.toFixed(2)} ({percent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-2 transition-all duration-700 ${
                isProfit
                  ? 'bg-emerald-500'
                  : isLoss
                  ? 'bg-red-500'
                  : 'bg-gray-400'
              }`}
              style={{
                width: `${Math.min(Math.abs(percent), 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {percent >= 0 ? '▲' : '▼'} {percent.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  )
}
