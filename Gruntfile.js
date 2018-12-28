// Generated on 2014-10-21 using generator-jhipster 1.4.0
'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-protractor-runner');
    var path = require('path');

    grunt.initConfig({
        protractor: {
            builddocker: {
                options: {
                    configFile: 'protractor.build.docker.conf.js'
                }
            }
        }
    });

    grunt.registerTask('builddocker', [
        'protractor:builddocker'
    ]);
};