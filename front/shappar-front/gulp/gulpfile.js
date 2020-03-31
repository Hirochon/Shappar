const gulp = require('gulp')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssDeclarationSorter = require('css-declaration-sorter')
const mqpacker = require('css-mqpacker')

//* .scssのwatch（その他のファイルがある時に使うといい）
gulp.task('default', function () {
  return gulp.watch('./*.scss', function () {
    return (
      gulp
        .src('./style.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(plumber())
        .pipe(postcss([
          autoprefixer({
            overridebrowserslist: ['last 4 versions'],
            cascade: false
          }),
          cssDeclarationSorter({
            order: 'smacss'
          }),
          mqpacker()
        ]))
        .pipe(cleanCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('../public/css'))
    )
  })
})
