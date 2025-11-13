export function mergePrices(portfolio, prices) {
  if (!prices || typeof prices !== 'object') return portfolio
  return portfolio.map(item => {
    const live = prices[item.symbol]
    if (!live) return item
    return {
      ...item,
      currentPrice: typeof live.currentPrice === 'number' ? live.currentPrice : null,
      open: live.open ?? null,
      high: live.high ?? null,
      low: live.low ?? null
    }
  })
}

export function calculateSummary(items) {
  let totalInvestment = 0
  let totalCurrentValue = 0
  items.forEach(s => {
    totalInvestment += Number(s.buyPrice || 0) * Number(s.quantity || 0)
    if (typeof s.currentPrice === 'number') {
      totalCurrentValue += Number(s.currentPrice) * Number(s.quantity || 0)
    }
  })
  const netPL = totalCurrentValue - totalInvestment
  const percent = totalInvestment > 0 ? (netPL / totalInvestment) * 100 : 0
  return { totalInvestment, totalCurrentValue, netPL, percent }
}
