import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle } from 'lucide-react'

export default function EditStockModal({ isOpen, onClose, stock, onSave }) {
  const [symbol, setSymbol] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && stock) {
      setSymbol(stock.symbol || '')
      setBuyPrice(stock.buyPrice?.toString() || '')
      setQuantity(stock.quantity?.toString() || '')
      if (inputRef.current) inputRef.current.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    const handleKeyDown = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, stock, onClose])

  function handleSave(e) {
    e.preventDefault()
    setError('')

    if (!symbol.trim() || !buyPrice || !quantity) {
      setError('All fields are required.')
      return
    }

    if (Number(buyPrice) <= 0 || Number(quantity) <= 0) {
      setError('Buy price and quantity must be greater than zero.')
      return
    }

    let cleanSymbol = symbol.toUpperCase().trim()
    if (!cleanSymbol.endsWith('.BSE')) cleanSymbol += '.BSE'

    const updatedStock = {
      ...stock,
      _id: stock._id,        // IMPORTANT → ensures backend can update correct document
      symbol: cleanSymbol,
      buyPrice: Number(buyPrice),
      quantity: Number(quantity),
      lastUpdated: new Date().toISOString(),
    }

    onSave(updatedStock)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.form
            onSubmit={handleSave}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Edit Stock
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Close"
              >
                <XCircle className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">
                  Symbol (BSE)
                </label>
                <input
                  ref={inputRef}
                  value={symbol}
                  onChange={e => setSymbol(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-transparent dark:bg-gray-800 outline-none transition"
                  placeholder="RELIANCE.BSE"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">
                  Buy Price (₹)
                </label>
                <input
                  type="number"
                  value={buyPrice}
                  onChange={e => setBuyPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-transparent dark:bg-gray-800 outline-none transition"
                  placeholder="e.g., 2400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-transparent dark:bg-gray-800 outline-none transition"
                  placeholder="e.g., 10"
                />
              </div>

              {error && (
                <motion.p
                  className="text-sm text-red-600 font-medium bg-red-50 dark:bg-red-900/40 p-2 rounded"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
