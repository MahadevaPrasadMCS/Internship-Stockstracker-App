// controllers/quoteController.js

import axios from "axios";

export const getQuote = async (req, res) => {
  try {
    const { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({ message: "Stock symbol is required." });
    }

    const apiKey = process.env.MARKETSTACK_API_KEY;

    const url = `http://api.marketstack.com/v1/eod/latest?access_key=${apiKey}&symbols=${symbol}`;

    const response = await axios.get(url);
    const data = response.data;

    if (!data || !data.data || data.data.length === 0) {
      return res.status(404).json({
        message: "No data returned for this symbol (try US stocks like AAPL, TSLA, MSFT).",
      });
    }

    const stock = data.data[0];

    return res.json({
      symbol: stock.symbol,
      date: stock.date,
      open: stock.open,
      high: stock.high,
      low: stock.low,
      close: stock.close,
      volume: stock.volume,
      currency: "USD",
      source: "marketstack",
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("MarketStack Error:", error);
    return res.status(500).json({
      message: "Failed to fetch quote",
      error: error.message,
    });
  }
};
