import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, XCircle } from 'lucide-react'

export default function AddStockModal({ isOpen, onClose, onAdd }) {
  const [symbol, setSymbol] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  /* -----------------------------------
     Focus, ESC support, scroll lock
  ----------------------------------- */
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    const handleEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  /* -----------------------------------
     Submit Handler
  ----------------------------------- */
  function handleAdd(e) {
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

    const cleanSymbol = symbol.trim().toUpperCase()

    // US ticker validation
    if (!/^[A-Z0-9.-]{1,10}$/.test(cleanSymbol)) {
      setError('Enter a valid US ticker (AAPL, TSLA, MSFT, BRK.B).')
      return
    }

    const newItem = {
      id: uuidv4(),
      symbol: cleanSymbol,
      buyPrice: Number(buyPrice),
      quantity: Number(quantity),
      purchaseDate: new Date().toISOString(),
    }

    onAdd(newItem)
    setSymbol('')
    setBuyPrice('')
    setQuantity('')
    onClose()
  }

  /* -----------------------------------
     UI
  ----------------------------------- */
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/50 dark:bg-black/60 backdrop-blur-sm
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={handleAdd}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="
              w-full max-w-md p-6 rounded-2xl shadow-2xl
              bg-gradient-to-br from-white/90 to-white/70
              dark:from-gray-900/90 dark:to-gray-900/70
              border border-gray-200/60 dark:border-gray-700/60
              backdrop-blur-md
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <PlusCircle size={20} className="text-indigo-600" />
                Add US Stock
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="
                  p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 
                  transition
                "
              >
                <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {/* Symbol */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Symbol (US)
                </label>
                <input
                  ref={inputRef}
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="AAPL, TSLA, MSFT, BRK.B"
                  className="
                    w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                    bg-white/70 dark:bg-gray-800/60 
                    focus:ring-2 focus:ring-indigo-500 outline-none
                  "
                />
              </div>

              {/* Buy Price */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Buy Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="e.g., 273.20"
                  className="
                    w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                    bg-white/70 dark:bg-gray-800/60 
                    focus:ring-2 focus:ring-indigo-500 outline-none
                  "
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g., 5"
                  className="
                    w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                    bg-white/70 dark:bg-gray-800/60 
                    focus:ring-2 focus:ring-indigo-500 outline-none
                  "
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    text-sm text-red-600 bg-red-100/70 dark:bg-red-900/40 
                    p-2 rounded-lg border border-red-200/30 dark:border-red-800
                  "
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="
                  px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                  text-gray-700 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-800 transition
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  px-4 py-2 rounded-lg bg-indigo-600 text-white 
                  hover:bg-indigo-700 transition shadow-md font-medium
                "
              >
                Add Stock
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
