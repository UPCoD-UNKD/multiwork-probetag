const { createProxyMiddleware } = require('http-proxy-middleware');

// Only log in development
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = function(app) {
  if (isDevelopment) {
    console.log('[setupProxy] Setting up proxy for /api -> http://localhost:8080');
  }
  
  // Proxy only API requests, not webpack hot-update files
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false, // Allow self-signed certificates if needed
      logLevel: isDevelopment ? 'debug' : 'silent',
      // IMPORTANT: When using app.use('/api', ...), Express removes /api from req.path
      // http-proxy-middleware uses req.url which also has /api removed
      // We need to add /api back so backend receives /api/auth/login, not /auth/login
      pathRewrite: function (path, req) {
        // path is already without /api prefix (e.g., /auth/login)
        // Add /api back: /auth/login -> /api/auth/login
        return '/api' + path;
      },
      // Important: Don't modify headers that might affect Spring Security
      // Handle errors
      onError: (err, req, res) => {
        // Only log errors in development, but always return error response
        if (isDevelopment) {
          console.warn('Proxy error:', err.message);
          console.warn('Request URL:', req.url);
          console.warn('Make sure the backend is running on http://localhost:8080');
        }
        if (!res.headersSent) {
          res.status(500).json({ 
            error: 'Proxy error', 
            message: 'Failed to connect to backend server' 
          });
        }
      }
    })
  );
};
