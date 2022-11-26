// .babelrcもbabelの設定ファイルで、違いは
//    babel.config.js:プロジェクト全体の設定
//    .babelrc:ファイル個別の設定
// その結果babel.config.jsより優先されておりコンパイルエラー
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  env: {
    test: {
      presets: [['env', { targets: { node: 'current' } }]]
    }
  }
}
