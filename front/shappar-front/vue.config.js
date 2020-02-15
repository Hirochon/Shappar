module.exports = {
  outputDir: '../../static',
  indexPath: '../templates/index.html',
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://d3ms402csqm2a0.cloudfront.net/static'
    : '/',
  devServer: {
    proxy: {
      '/api/': {
        target: 'http://localhost:8000/'
      }
    }
  }
}
