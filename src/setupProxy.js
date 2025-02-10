const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://192.168.188.76:7009',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  );
}; 