/**
 * Centralized Express error handler middleware
 * Handles all thrown or forwarded (next) errors in controllers
 */
export default function errorHandler(err, req, res, next) {
  console.error('❌ Server Error:', err.message)

  // Default to 500 if no status code is set
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode).json({
    success: false,
    statusCode,
    message:
      err.message ||
      'Something went wrong on the server. Please try again later.',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  })
}
