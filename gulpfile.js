'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var paths = {
  js: 'app/js/**/*.js',
  fonts: ['app/fonts/**.*',
    'bower_components/bootstrap/dist/fonts/*.{ttf,woff,eof,svg}',
    'bower_components/fontawesome/fonts/*.{ttf,woff,eof,svg}',
    'bower_components/ionicons/fonts/*.{ttf,woff,eof,svg}'],
  images: 'app/img/**/*.*',
  styles: ['bower_components/bootstrap/dist/css/bootstrap.css', 
    'bower_components/fontawesome/css/font-awesome.css',
    'bower_components/ionicons/css/ionicons.css',
    'app/styles/**/*.scss'],
  files: ['app/index.html', 'app/favicon.png'],
  templates: 'app/templates/**/*.html',
  dest: 'public/',
  vendors: ['bower_components/angular/angular.js',
    'bower_components/angular-cookies/angular-cookies.js',
    'bower_components/angular-bootstrap/ui-bootstrap.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/satellizer/satellizer.js']
};

// The name of the Angular module which will be injected into the templates.
var moduleName = 'RaspberryPi-Dashboard';

// Minify and copy all 3rd party libs to vendors.min.js
gulp.task('copy-vendors', function() {
  return gulp.src(paths.vendors)
    .pipe(plugins.uglify())
    .pipe(plugins.concat('vendors.min.js'))
    .pipe(gulp.dest(paths.dest));
});

// Minify and copy all dashboard script files to app.min.js
gulp.task('copy-scripts', function() {
  return gulp.src(paths.js)
    .pipe(plugins.uglify())
    .pipe(plugins.concat('app.min.js'))
    .pipe(gulp.dest(paths.dest));
});

// Minify and copy all angular templates to templates.min.js
gulp.task('copy-templates', function() {
  return gulp.src(paths.templates)
    .pipe(plugins.minifyHtml({quotes: true}))
    .pipe(plugins.angularTemplatecache({module: moduleName}))
    .pipe(plugins.uglify())
    .pipe(plugins.concat('templates.min.js'))
    .pipe(gulp.dest(paths.dest));
});

// Copy all static/HTML files to output directory
gulp.task('copy-files', function(){
  return gulp.src(paths.files)
    .pipe(gulp.dest(paths.dest));
});

// Copy all images to output directory
gulp.task('copy-images', function(){
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.dest+'img'));
});

// Copy all fonts to output directory
gulp.task('copy-fonts', function(){
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dest+'fonts'));
});

// Compile styles into dashboard.css
gulp.task('compile-styles', function() {
  return gulp.src(paths.styles)
    .pipe(plugins.sass({errLogToConsole: true}))
    .pipe(plugins.minifyCss())
    .pipe(plugins.concat('dashboard.min.css'))
    .pipe(gulp.dest(paths.dest));
});

// Lint Task
gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// Scripts Task
gulp.task('scripts', function() {
  return gulp.src(paths.js)
    .pipe(plugins.wrap('(function(){ \n<%= contents %>\n})();'))
    .pipe(plugins.concat('dashboard.js'))
    .pipe(plugins.ngAnnotate())
    .pipe(gulp.dest(paths.dest))
    .pipe(plugins.rename({extname: '.min.js'}))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(paths.dest));
});

// Watch Task
gulp.task('watch', function() {
  //gulp.watch(paths.js, ['lint', 'scripts']);
  gulp.watch(paths.vendors, ['copy-vendors']);
  gulp.watch(paths.js, ['copy-scripts']);
  gulp.watch(paths.templates, ['copy-templates']);
  gulp.watch(paths.files, ['copy-files']);
  gulp.watch(paths.images, ['copy-images']);
  gulp.watch(paths.fonts, ['copy-fonts']);
  gulp.watch(paths.styles, ['compile-styles']);
});

// Webserver Task
gulp.task('webserver', function() {
  gulp.src(paths.dest)
    .pipe(plugins.webserver({
      host: '0.0.0.0',
      port: 3000,
      livereload: true,
      directoryListing: false,
      fallback: 'index.html',
      open: false
    }));
});

gulp.task('build', ['copy-vendors', 'copy-scripts', 'copy-templates', 'copy-files', 'copy-images', 'copy-fonts', 'compile-styles']);
gulp.task('default', ['build', 'webserver', 'watch']);
