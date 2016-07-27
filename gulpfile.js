var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglifySaveLicense = require('uglify-save-license'),
    sourcemaps = require('gulp-sourcemaps'),
    karma = require('karma');

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

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

// gulp.task('default', gulp.series('clean', 'build')); gulp 4
gulp.task('default', ['clean', 'build']);