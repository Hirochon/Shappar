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
  productionSourceMap: process.env.NODE_ENV !== 'production',
  chainWebpack: config => {
    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2
            }
          }
        }
      })
  }
}
