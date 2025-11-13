import axios from 'axios'

/** @desc Fetch live/daily stock quote from Alpha Vantage (BSE supported) */
export const getQuote = async (req, res, next) => {
  try {
    const { symbol } = req.query;
    if (!symbol) {
      return res.status(400).json({ message: "Stock symbol is required." });
    }

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Alpha Vantage API key is not configured." });
    }

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    const { data } = await axios.get(url);

    // robust: detect ANY time series key
    const seriesKey = Object.keys(data).find(k =>
      /time\s*series/i.test(k)
    );

    const series = seriesKey ? data[seriesKey] : null;

    if (!series) {
      console.log("FULL ALPHA RESPONSE:", data);
      console.log("Alpha Keys:", Object.keys(data));
      return res.status(404).json({
        message: "No time series data found in Alpha Vantage response.",
        receivedKeys: Object.keys(data)
      });
    }

    const entries = Object.entries(series);
    const [latestDate, latestStats] = entries[0];
    const [previousDate, previousStats] = entries[1] || [];

    res.json({
      symbol: symbol.toUpperCase(),
      date: latestDate,
      open: parseFloat(latestStats["1. open"]),
      high: parseFloat(latestStats["2. high"]),
      low: parseFloat(latestStats["3. low"]),
      close: parseFloat(latestStats["4. close"]),
      previousClose: previousStats ? parseFloat(previousStats["4. close"]) : null,
      volume: parseInt(latestStats["5. volume"]),
      fetchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error fetching quote:", error.message);
    next(error);
  }
};

