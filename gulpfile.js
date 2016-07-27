var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglifySaveLicense = require('uglify-save-license'),
    sourcemaps = require('gulp-sourcemaps'),
    karma = require('karma'),
    path = require('path');

gulp.task('build', function() {
    return gulp.src('src/angular.lastfm.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(gulp.dest('dist/'))
        .pipe(uglify({preserveComments: uglifySaveLicense}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function() {
    return del('dist/');
});


function runTests (singleRun, done) {
  var reporters = ['spec'];
  var preprocessors = {};

  var localConfig = {
    configFile: path.join(__dirname, '/karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun,
    reporters: reporters,
    preprocessors: preprocessors
  };

  var server = new karma.Server(localConfig, function(failCount) {
    done(failCount ? new Error('Failed ' + failCount + ' tests.') : null);
  })
  server.start();
}

/**
 * Run test once and exit
 */
gulp.task('test', function(done) {
    runTests(true, done);
});

gulp.task('default', gulp.series('clean', 'build'));