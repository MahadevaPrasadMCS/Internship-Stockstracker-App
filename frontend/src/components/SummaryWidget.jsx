import React from "react";
import { calculateSummary } from "../utils/calculatePL";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function SummaryWidget({ items }) {
  const { totalInvestment, totalCurrentValue, netPL, percent } =
    calculateSummary(items);

  const isProfit = netPL > 0;
  const isLoss = netPL < 0;

  const usd = (val) =>
    val?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  return (
    <div className="bg-gradient-to-br from-white/80 to-indigo-50/60 dark:from-gray-800/70 dark:to-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-xl animate-fadeIn">
      {/* Title */}
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Portfolio Summary
      </h3>

      {/* Values */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">
            Total Investment
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {usd(totalInvestment)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">
            Current Value
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {usd(totalCurrentValue)}
          </span>
        </div>

        {/* Net P/L */}
        <div
          className={`flex justify-between items-center mt-3 font-semibold ${
            isProfit
              ? "text-emerald-600"
              : isLoss
              ? "text-red-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <span>Net P/L</span>

          <span className="flex items-center gap-1">
            {isProfit && <TrendingUp size={16} />}
            {isLoss && <TrendingDown size={16} />}
            {usd(netPL)}{" "}
            <span className="text-xs font-normal opacity-80">
              ({percent.toFixed(2)}%)
            </span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                isProfit
                  ? "bg-emerald-500"
                  : isLoss
                  ? "bg-red-500"
                  : "bg-gray-500"
              }`}
              style={{
                width: `${Math.min(Math.abs(percent), 100)}%`,
              }}
            ></div>
          </div>

          <p className="text-xs mt-1 text-right text-gray-500 dark:text-gray-400">
            {percent >= 0 ? "▲" : "▼"} {percent.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
