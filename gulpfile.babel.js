import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemap from 'gulp-sourcemaps';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import imagemin, {mozjpeg, optipng, svgo} from 'gulp-imagemin';
import {deleteAsync} from 'del';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';

const server = browserSync.create();

export const css = () => {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
};

export const minify = () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
};

export const compress = () => {
  return gulp.src('src/js/*.js')
    .pipe(terser())
    .pipe(rename((path) => {
      path.basename += ".min";
    }))
    .pipe(gulp.dest('build/js'));
};

export const images = () => {
  return gulp.src('src/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      optipng({ optimizationLevel: 3 }),
      mozjpeg({ quality: 75, progressive: true }),
      svgo()
    ]))
    .pipe(gulp.dest('build/img'));
};



export const copy = () => {
  return gulp.src([
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**'
  ], {
    base: 'src'
  })
    .pipe(gulp.dest('build'));
};

export const clean = () => {
  return deleteAsync('build');
};

export const build = gulp.series(
  clean,
  copy,
  css,
  minify,
  compress,
  images
);

export function serverTask() {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('src/sass/**/*.scss', gulp.series(css));
  gulp.watch('src/*.html', gulp.series(minify, refresh));
  gulp.watch('src/js/*.js', gulp.series(compress, refresh));
}

export function refresh(done) {
  server.reload();
  done();
}

export const start = gulp.series(build, serverTask);