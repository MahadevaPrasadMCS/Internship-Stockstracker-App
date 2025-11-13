// src/components/PriceRangeSelector.jsx
import React from 'react'

const ranges = ['1D', '5D', '1M', '3M', '1Y', 'ALL']

export default function PriceRangeSelector({ value, onChange }) {
  return (
    <div className="inline-flex gap-2 bg-white/5 p-1 rounded-lg border border-gray-700">
      {ranges.map(r => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition ${
            value === r ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-gray-800/40'
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  )
}
