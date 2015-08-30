var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var _             = require('lodash');
var browserSync   = require('browser-sync');
var at            = require('gulp-asset-transform');

var paths = {
  fonts       : 'src/fonts/*.*',
  index       : 'src/index.html',
  less        : 'src/less/*.less'
};

var release;

function dest(suffix) {
  return gulp.dest(release ? 'release/' + suffix : 'develop/' + suffix);
}


gulp.task('copy-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe($.plumber())
    .pipe($.size({ title: 'fonts' }))
    .pipe(dest('fonts'));
});

gulp.task('at-build', function() {
  return gulp.src(paths.index)
    .pipe($.plumber())
    .pipe(at({
      css: {
        stream: function(filestream, outputfilename) {
          return filestream
            .pipe($.if(!release, $.sourcemaps.init()))
            .pipe($.less())
            .pipe($.concat(outputfilename))
            .pipe($.if(!release, $.sourcemaps.write()))
            .pipe($.if(release, $.minifyCss()))
            .pipe($.if(release, $.rev()))
            .pipe($.size({ title: 'site.css', showFiles: true }));
        }
      }
    }))
    .pipe(dest(''))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('less-lint', function() {
  gulp.src(paths.less)
    .pipe($.plumber())
    .pipe($.recess())
    .pipe($.recess.reporter());
});



gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: release ? 'release/' : 'develop/'
    },
    logConnections: true,
    open: false
  });
});

gulp.task('watch', function() {
  gulp.watch([paths.index, paths.less], ['at-build']);
  gulp.watch([paths.fonts], ['copy-assets']);
  gulp.watch([paths.less], ['less-lint']);
});

gulp.task('copy-assets', ['copy-fonts']);
gulp.task('build', ['copy-assets', 'at-build']);
gulp.task('develop', ['build', 'server', 'watch']);


gulp.task('setRelease', function(done) { release = true; done(); });

gulp.task('release', ['setRelease', 'build']);
