import yahooFinance from "yahoo-finance2";

// Create instance (required for newer versions)
const yf = yahooFinance.createYahooFinance();

export const getQuote = async (req, res) => {
  try {
    let { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ message: "Stock symbol is required." });
    }

    // Normalize user input
    let clean = symbol.toUpperCase().trim();

    // Convert legacy formats
    if (clean.endsWith(".BSE")) clean = clean.replace(".BSE", ".BO");
    if (clean.endsWith(".NSE")) clean = clean.replace(".NSE", ".NS");

    // Default to BSE
    if (!clean.endsWith(".BO") && !clean.endsWith(".NS")) {
      clean += ".BO";
    }

    let quote;

    try {
      // Correct Yahoo Finance API call
      quote = await yf.quote(clean);
    } catch (err) {
      return res.status(404).json({
        message: "Yahoo Finance could not fetch the data.",
        error: err.message,
      });
    }

    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({
        message: "No live price available for this symbol.",
        symbol: clean,
      });
    }

    res.json({
      symbol: clean,
      currentPrice: quote.regularMarketPrice ?? null,
      open: quote.regularMarketOpen ?? null,
      high: quote.regularMarketDayHigh ?? null,
      low: quote.regularMarketDayLow ?? null,
      previousClose: quote.regularMarketPreviousClose ?? null,
      volume: quote.regularMarketVolume ?? null,
      currency: quote.currency ?? "INR",
      fetchedAt: new Date().toISOString(),
      source: "yahoo-finance"
    });

  } catch (error) {
    console.error("Quote Error:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
