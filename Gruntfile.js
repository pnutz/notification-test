module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/scss',
                    src: ['*.scss'],
                    dest: 'web/css',
                    ext: '.css'
                }]
            }
        },

        watch: {
            options: {
                // does not spawn child process on each watch task execution (speed+, possibility of failure)
                spawn: false,
                maxListeners: 99,
            },
            sass: {
                files: ['assets/scss/**'],
                tasks: ['sass']
            },
            js: {
                files: ['assets/js/**'],
                tasks: ['newer:copy:js']
            }
        },

        copy: {
            js: {
                files: [{
                    expand: true,
                    cwd: 'assets/js/',
                    src: ['**'],
                    dest: 'web/js/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask('build', ['sass', 'copy:js']);
};
