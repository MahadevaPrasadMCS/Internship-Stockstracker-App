// Merge backend portfolio with live prices
export function mergePrices(portfolio, prices) {
  return portfolio.map(item => {
    const live = prices.find(p => p.symbol === item.symbol)
    return live
      ? { ...item, currentPrice: live.currentPrice }
      : { ...item }
  })
}

// Calculate portfolio summary
export function calculateSummary(items) {
  let totalInvestment = 0
  let totalCurrentValue = 0

  items.forEach(stock => {
    totalInvestment += stock.buyPrice * stock.quantity
    if (stock.currentPrice) {
      totalCurrentValue += stock.currentPrice * stock.quantity
    }
  })

  const netPL = totalCurrentValue - totalInvestment
  const percent = totalInvestment > 0 ? (netPL / totalInvestment) * 100 : 0

  return {
    totalInvestment,
    totalCurrentValue,
    netPL,
    percent,
  }
}
