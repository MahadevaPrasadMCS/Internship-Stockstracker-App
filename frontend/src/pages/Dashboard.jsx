import React, { useState, useEffect, useMemo } from 'react'
import SummaryWidget from '../components/SummaryWidget'
import PortfolioTable from '../components/PortfolioTable'
import AddStockModal from '../components/AddStockModal'
import EditStockModal from '../components/EditStockModal'
import useStockPrices from '../hooks/useStockPrices'
import { getPortfolio, addStock, updateStock, deleteStock } from '../api/backendAPI'
import { mergePrices } from '../utils/calculatePL'
import { PlusCircle } from 'lucide-react'

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  const [toast, setToast] = useState(null)

  // Load portfolio on mount
  useEffect(() => {
    ;(async () => {
      try {
        const data = await getPortfolio()
        setItems(data)
      } catch (err) {
        console.error('Portfolio load failed:', err)
        showToast('❌ Failed to load portfolio', 'error')
      }
    })()
  }, [])

  // Memoized symbols (prevents unnecessary re-fetches)
  const symbols = useMemo(() => items.map(i => i.symbol), [items])
  const { prices, isLoading, lastUpdated } = useStockPrices(symbols, { interval: 60000 })
  const mergedItems = mergePrices(items, prices)

  // Toast helper
  function showToast(message, type = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }

  // Add stock
  async function handleAdd(stock) {
    try {
      const newItem = await addStock(stock)
      setItems(prev => [newItem, ...prev])
      showToast(`✅ Added ${stock.symbol}`)
    } catch (err) {
      console.error('Add failed', err)
      showToast('❌ Failed to add stock', 'error')
    }
  }

  // Delete stock
  async function handleDelete(id) {
    try {
      await deleteStock(id)
      setItems(prev => prev.filter(s => s._id !== id))
      showToast('🗑️ Stock deleted', 'warning')
    } catch (err) {
      console.error('Delete failed', err)
      showToast('❌ Delete failed', 'error')
    }
  }

  // Edit stock
  function handleEdit(stock) {
    setSelectedStock(stock)
    setEditOpen(true)
  }

  // Save updated stock
async function handleSave(updatedStock) {
  try {
    const saved = await updateStock(updatedStock._id || updatedStock.id, updatedStock)

    setItems(prev =>
      prev.map(s => (s._id === saved._id ? saved : s))
    )

    showToast(`✏️ Updated ${saved.symbol}`)
  } catch (err) {
    console.error("Update failed:", err)
    showToast("❌ Failed to update stock", "error")
  }
}

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-sm p-4 rounded-lg border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight mb-3 sm:mb-0">
          My BSE Portfolio
        </h2>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition"
        >
          <PlusCircle size={18} />
          Add Stock
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <p className="text-sm text-gray-500 px-2 animate-pulse">
          Fetching latest BSE prices…
        </p>
      )}

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {mergedItems.length > 0 ? (
            <PortfolioTable
              items={mergedItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-10 text-center bg-white">
              <p className="text-lg font-medium text-gray-700 mb-1">
                No stocks yet
              </p>
              <p className="text-sm text-gray-500">
                Use “Add Stock” to start tracking your BSE investments.
              </p>
            </div>
          )}

          {lastUpdated && (
            <p className="text-xs text-gray-400 text-right">
              ⏱ Updated at{' '}
              <span className="font-medium text-gray-600">
                {new Date(lastUpdated).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </p>
          )}
        </div>

        <aside>
          <SummaryWidget items={mergedItems} />
        </aside>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-white animate-fadeIn ${
            toast.type === 'error'
              ? 'bg-red-600'
              : toast.type === 'warning'
              ? 'bg-yellow-500'
              : 'bg-emerald-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Modals */}
      <AddStockModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />

      <EditStockModal
        isOpen={editOpen}
        stock={selectedStock}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
