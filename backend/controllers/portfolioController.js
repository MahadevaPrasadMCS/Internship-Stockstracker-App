import Portfolio from '../models/Portfolio.js'

/** @desc Fetch all portfolio items for logged-in user */
export const getPortfolio = async (req, res, next) => {
  try {
    const items = await Portfolio.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json(items)
  } catch (err) {
    next(err)
  }
}

/** @desc Add a new stock to user portfolio */
export const addStock = async (req, res, next) => {
  try {
    const { symbol, buyPrice, quantity } = req.body

    if (!symbol || !buyPrice || !quantity) {
      return res.status(400).json({ message: 'Symbol, buy price, and quantity are required.' })
    }

    const stock = await Portfolio.create({
      symbol,
      buyPrice,
      quantity,
      user: req.user.id,
    })

    res.status(201).json({
      message: 'Stock added successfully.',
      stock,
    })
  } catch (err) {
    next(err)
  }
}

/** @desc Update a stock in portfolio */
export const updateStock = async (req, res) => {
  try {
    // Prevent _id overwrite
    const { _id, id, ...updateData } = req.body

    const updated = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ message: "Stock not found or unauthorized" })
    }

    res.json(updated)
  } catch (error) {
    console.error("Update error:", error)
    res.status(500).json({ message: "Failed to update stock" })
  }
}


/** @desc Delete a stock from portfolio */
export const deleteStock = async (req, res, next) => {
  try {
    const stock = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found or unauthorized action.' })
    }

    res.status(200).json({
      message: 'Stock deleted successfully.',
      id: req.params.id,
    })
  } catch (err) {
    next(err)
  }
}
