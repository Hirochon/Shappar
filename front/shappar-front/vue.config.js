module.exports = {
    outputDir: '../../static',
    indexPath: '../templates/index.html',
    publicPath: process.env.NODE_ENV === 'production'
      ? '/static/'
      : '/',
    devServer: {
      proxy: {
        "/api/": {
          target: "http://localhost:3000/",
        }
      }
    }
  }