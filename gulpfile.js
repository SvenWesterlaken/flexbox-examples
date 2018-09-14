const gulp        = require('gulp');
const plumber     = require('gulp-plumber');
const pug         = require('gulp-pug');
const sass        = require('gulp-sass');
const prefix      = require('gulp-autoprefixer');
const clean       = require('gulp-clean-css');
const jshint      = require('gulp-jshint');
const uglify      = require('gulp-uglify');
const babel       = require('gulp-babel');
const concat      = require('gulp-concat');
const rename      = require('gulp-rename');
const browserSync = require('browser-sync');
const reload      = browserSync.reload;

const sassFolder  = 'sass';
const pugFolder   = 'pug';
const jsFolder    = 'js';

gulp.task('browser-sync', ['sass', 'js'], () => {
  browserSync.init({
    server: './public',
    port: 3000,
    browser: 'chrome',
    logPrefix: "Flexbox Examples"
  });
});

gulp.task('pug', () => {
  return gulp
    .src(`${pugFolder}/*.pug`)
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest('public'))
    .pipe(reload({stream:true}));
});

gulp.task('sass', () => {
  return gulp
    .src(`${sassFolder}/main.sass`)
    .pipe(plumber({ errorHandler: sass.logError }))
    .pipe(sass())
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(clean({keepSpecialComments: 0}))
    .pipe(rename({suffix: '.min', basename: 'style', extname: '.css'}))
    .pipe(gulp.dest('public'))
    .pipe(reload({stream:true}));
});

gulp.task('js', () => {
  return gulp
    .src(`${jsFolder}/*.js`)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public'))
    .pipe(reload({stream:true}))
});

gulp.task('watch', () => {
  gulp.watch(`${jsFolder}/*.js`, ['js']);
  gulp.watch([`${sassFolder}/main.sass`, `${sassFolder}/**/*.sass`], ['sass']);
  gulp.watch([`${pugFolder}/*.pug`, `${pugFolder}/sections/*.pug`], ['pug']);
});

gulp.task('default', ['browser-sync', 'watch']);
