/*!
 npm install gulp gulp-sass gulp-sourcemaps gulp-autoprefixer gulp-minify-css gulp-jshint gulp-uglify gulp-concat gulp-rename gulp-imagemin gulp-cache sassdoc gulp-notify --save-dev
 */

'use strict';

// Load plugins 
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var imagemin = require('gulp-imagemin');
var imagemin = require('gulp-cache');
var sassdoc = require('sassdoc');
var notify = require('gulp-notify');

// variables
var cssIn = "dev/scss/**/*.scss";
var cssMain = "dev/scss/core.scss";
var cssOut = "prod/css/";

var jsIn = "dev/lib/custom.js";
var jsOut = "prod/js/";

var imgIn ="dev/img/*";
var imgOut = "prod/img/";

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};


 
gulp.task('sass', function () {
  return gulp
    .src(cssMain)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(cssOut));
});

gulp.task('scripts', function() {
  return gulp.src(jsIn)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(jsOut))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(jsOut))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('imgIn')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('imgOut'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('watch', function() {
  gulp.watch(cssIn, ['sass']);
  gulp.watch(jsIn, ['scripts']);
  gulp.watch(imgIn, ['images']);

});

gulp.task('sassdoc', function () {
  var options = {
    dest: 'docs',
    verbose: true
  };
  return gulp.src(cssIn)
    .pipe(sassdoc(options));
});

gulp.task('prod', function () {
  return gulp
    .src(cssMain)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(cssOut))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(cssOut))
    .pipe(notify({ message: 'Production task complete' }));
});


gulp.task('default', ['sass', 'watch' /*, possible other tasks... */]);