'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  grunt.initConfig({

    watch: {
      compass: {
        files: ['app/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      js: {
        files: ['app/scripts/{,*/}*.js'],
        tasks: ['jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          'app/{,*/}*.html',
          'app/styles/{,*/}*.css'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          'app/scripts/{,*/}*.js'
        ]
      }
    },

    compass: {
      options: {
        sassDir: 'app/styles',
        cssDir: 'app/styles',
        javascriptsDir: 'app/scripts',
        // importPath: './bower_components',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ]
    },
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function () {

    grunt.task.run([
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });

};
