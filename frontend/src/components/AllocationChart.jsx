import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'

// Softer & modern color palette
const COLORS = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
]

export default function AllocationChart({ items = [] }) {
  const data = items
    .filter((s) => s.currentPrice && s.quantity)
    .map((s) => ({
      name: s.symbol,
      value: (s.currentPrice ?? 0) * (s.quantity ?? 0),
    }))
    .sort((a, b) => b.value - a.value)

  if (!data.length) {
    return (
      <div className="p-5 rounded-2xl bg-white/10 dark:bg-gray-800/40 
        backdrop-blur-md border border-gray-300/30 dark:border-gray-700 text-sm text-gray-500">
        No portfolio allocation available. Add stocks to view distribution.
      </div>
    )
  }

  return (
    <div
      className="
        w-full h-64 rounded-2xl p-5 
        bg-gradient-to-br from-white/40 via-white/20 to-white/10 
        dark:from-gray-900/40 dark:via-gray-900/20 dark:to-gray-900/10
        border border-gray-200/40 dark:border-gray-700/40
        backdrop-blur-xl shadow-xl
      "
    >
      <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3">
        Portfolio Allocation
      </h4>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={80}
            innerRadius={45}
            paddingAngle={2}
            labelLine={false}
            label={({ name }) => name}
            animationDuration={700}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-all"
              />
            ))}
          </Pie>

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
            }}
            itemStyle={{ color: '#fff' }}
            formatter={(value) => `$${Number(value).toLocaleString()}`}
          />

          <Legend
            verticalAlign="bottom"
            wrapperStyle={{
              fontSize: 12,
              paddingTop: 8,
              color: '#6b7280',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
