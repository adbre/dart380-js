module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    // configures browsers to run test against
    // any of [ 'PhantomJS', 'Chrome', 'Firefox', 'IE']
    var TEST_BROWSERS = ((process.env.TEST_BROWSERS || '').replace(/^\s+|\s+$/, '') || 'PhantomJS').split(/\s*,\s*/g);

    grunt.initConfig({
    karma: {
        options: {
            configFile: 'test/config/karma.unit.js'
        },
        single: {
            singleRun: true,
            autoWatch: false,
            browsers: TEST_BROWSERS
        },
        unit: {
            browsers: TEST_BROWSERS
        }
    }
    });

    grunt.registerTask('test', ['karma:single']);
    grunt.registerTask('auto-test', ['karma:unit']);
    grunt.registerTask('default', ['test']);
};
