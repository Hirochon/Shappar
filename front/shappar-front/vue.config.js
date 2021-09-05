module.exports = {
  outputDir: '../static',
  indexPath: './index.html',
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://d3ms402csqm2a0.cloudfront.net/static'
    : './',
  devServer: {
    proxy: {
      '/api/': {
        target: 'http://nginx/'
      }
    }
  },
  productionSourceMap: process.env.NODE_ENV !== 'production'
}
