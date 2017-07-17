var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var imagemin    = require('gulp-imagemin');
var serverPath  = 'dist';
var configPaths = {
        sass: {
            src:  'assets/sass',
            dest: serverPath + '/css'
        },
        image: {
            src:  'assets/images',
            dest: serverPath + '/images'
        },
        js: {
            src:       'assets/scripts',
            dest:      serverPath + '/js',
            bootstrap: {
                key:     '__bootstrap__',
                replace: '../../bower_components/bootstrap-sass/assets/javascripts/bootstrap'
            }
        },
        bower: 'bower_components'
    };

gulp.task('sass', function() {
    gulp.src(configPaths.sass.src + '/main.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            includePaths : [
                configPaths.sass.src,
                configPaths.bower + '/bootstrap-sass/assets/stylesheets'
            ]
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(
            [
                'last 15 versions',
                '> 1%',
                'ie 8',
                'ie 7'
            ],
            {cascade: true}
        ))
        .pipe($.minifyCss())
        .pipe(gulp.dest(configPaths.sass.dest))
        .pipe(browserSync.stream())
        .pipe($.size({title: 'Compiling SASS'}))
        .pipe($.sourcemaps.write('./maps'));
});

// gulp.task('jquery', function() {
//     gulp.src(configPaths.bower + '/jquery/dist/jquery.min.js')
//         .pipe(gulp.dest(configPaths.js.dest + '/libs'))
//         .pipe($.size({title: 'Copying jQuery'}));
// });

gulp.task('bootstrap_js', function() {
    var bootstrapPath = configPaths.js.bootstrap;

    gulp.src(configPaths.js.src + '/bootstrap.js')
        .pipe($.replace(bootstrapPath.key, bootstrapPath.replace))
        .pipe($.resolveDependencies({pattern: /\/\/ @require [\s-]*(.*?\.js)/g}))
        .pipe($.concat('bootstrap.min.js'))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(configPaths.js.dest + '/libs'))
        .pipe($.size({title: 'Generating Custom Bootstrap'}));
});

// gulp.task('images', function() {
//     gulp.src(configPaths.image.src + '/**/*')
//     .pipe(cache(imagemin({
//         optimizationLevel: 3,
//         progressive: true,
//         interlaced: true})))
//     .pipe(gulp.dest(configPaths.image.dest))
//     .pipe($.size({title: 'Copying Images'}));
// });

gulp.task('js', function() {
    gulp.src(configPaths.js.src + '/dev/*.js')
        .pipe($.concat('main.js'))
        .pipe(gulp.dest(configPaths.js.src))
        // .pipe($.uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(configPaths.js.dest))
        .pipe($.size({title: 'Generating JavaScript'}));
});

// Watch Files For Changes & Reload
gulp.task('watch', ['build'], function() {
    browserSync({
        port: 5000,
        notify: false,
        logPrefix: 'SASS_Project',
        snippetOptions: {
            rule: {
                match: '<span id="browser-sync-binding"></span>',
                fn: function(snippet) {
                    return snippet;
                }
            }
        },
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: {
            // baseDir: serverPath,
            baseDir: '',
            index: 'index.html'
        }
    });

    gulp.watch('/index.html', browserSync.reload);
    gulp.watch(configPaths.sass.src + '/**/{*.sass, *.scss}', ['sass']);
    gulp.watch(configPaths.js.src + '/dev/*.js', ['js', browserSync.reload]);
});

// Build Task
gulp.task('build', ['sass', 'bootstrap_js', 'js']);

// Default Task
gulp.task('default', ['build']);
