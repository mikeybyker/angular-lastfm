module.exports = function (config) {
    var configuration = {
        basePath: './',
        singleRun: true,
        autoWatch: false,
        logLevel: 'INFO',
        junitReporter: {
            outputDir: 'test-reports'
        },
        browsers: [
            'PhantomJS'
        ],
        frameworks: [
            'phantomjs-shim',
            'jasmine'
        ],
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'src/*.js',
            'src/*.spec.js'
        ],
        plugins: [
            require('karma-jasmine'),
            require('karma-junit-reporter'),
            require('karma-phantomjs-launcher'),
            require('karma-phantomjs-shim'),
            require('karma-spec-reporter')
        ],
        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        reporters: ['spec']
    };

    // fixtures
    configuration.files.push({pattern: 'mocks/*.json', watched: true, served: true, included: false});

    config.set(configuration);
};
