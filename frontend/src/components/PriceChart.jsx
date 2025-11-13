// src/components/PriceChart.jsx
import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts'

function formatUSD(v){ return `$${Number(v).toFixed(2)}` }

export default function PriceChart({ rawHistory = [], symbol = '', buyPrice = null, range = 'ALL' }) {
  // rawHistory: [{date: '2025-11-13', price: 273.47}, ...]
  const data = useMemo(() => {
    const arr = (rawHistory || []).slice()
    // Ensure ascending by date
    arr.sort((a,b) => (a.date > b.date ? 1 : -1))

    // filter by range
    if (range !== 'ALL') {
      const n = {
        '1D': 1,
        '5D': 5,
        '1M': 30,
        '3M': 90,
        '1Y': 365
      }[range] ?? arr.length
      return arr.slice(-n).map(d => ({ time: d.date, price: d.price }))
    }
    return arr.map(d => ({ time: d.date, price: d.price }))
  }, [rawHistory, range])

  if (!data.length) {
    return <div className="p-4 rounded-lg bg-white/5 text-sm text-gray-400">No history to display</div>
  }

  const startPrice = data[0].price
  const lastPrice = data[data.length - 1].price
  const pnl = buyPrice != null ? (lastPrice - buyPrice) * 1 : null

  return (
    <div className="w-full h-64 bg-white/5 rounded-lg p-3 border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-100">Price history — {symbol}</h4>
          <p className="text-xs text-gray-400">{data.length} points · {range}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-200 font-medium">{formatUSD(lastPrice)}</div>
          {pnl != null && (
            <div className={`text-xs mt-1 ${pnl>0? 'text-emerald-400' : pnl<0 ? 'text-red-400' : 'text-gray-400'}`}>
              {pnl > 0 ? '+' : ''}{formatUSD(pnl)} P/L
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="time" tick={{ fill: '#9CA3AF', fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} domain={['auto','auto']} width={64} tickFormatter={v => `$${v}`} />
          <Tooltip formatter={(v) => formatUSD(v)} labelStyle={{ color: '#9CA3AF' }} contentStyle={{ background: '#0f1724', border: '1px solid rgba(255,255,255,0.04)' }} />
          <Line type="monotone" dataKey="price" stroke="#7c3aed" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
          {/* buy price reference */}
          {buyPrice != null && <ReferenceLine y={buyPrice} stroke="#10b981" strokeDasharray="4 4" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
