// Generated by CoffeeScript 1.6.3
(function () {
    var browserify, colors, createBundle, createBundles, gulp, source, watchify;
    var through = require('through2');

    var gulp = require('gulp');

    var browserify = require('browserify');

    var watchify = require('watchify');

    var source = require('vinyl-source-stream');

    var colors = require('colors');

    var glob = require('glob');

    var istanbul = require('browserify-istanbul');

    var argv = require('yargs').argv;

    var replace = require('gulp-replace');


    var files = [
        {
            input: [config.paths.src.riqGridModule],
            output: config.filenames.release.scripts
        },
        {
            input: [config.paths.src.riqGridApp],
            output: config.filenames.build.scripts
        },
        {
            input: glob.sync('./src/modules/!(proto)/*.js'), //we load the tests through this symlink so istanbul can map correctly
            output: 'bundle-tests.js',
            dest: 'test-assets',
            istanbul: argv.coverage
        }
    ];


    createBundle = function (options, cb) {
        var isWatching = !global.release;
        var bundler, rebundle;
        var opts = isWatching ? {cache: {}, packageCache: {}, fullPaths: true} : {};
        opts.entries = options.input;
        opts.paths = config.paths.browserify;
        opts.debug = true;
        bundler = browserify(opts);

        if (options.istanbul) {
            //only do this when testing
            bundler.transform(istanbul({
                ignore: ['**/bower_components/**', '**/templates.js', '**/proto/**', '**/grid-spec-helper/**', '**/*.spec.js', '**/node_modules/!(@grid)/**', '**/src/modules/**'],
                defaultIgnore: false
            }), {global: true});
        }

        if (isWatching) {
            bundler = watchify(bundler);
        }

        //this puts a semicolon right before the source maps comment, sorta annoying but works
        bundler.pipeline.get('wrap').push(through.obj(function (row, enc, next) {
            this.push(new Buffer(row.toString().replace('//# sourceMappingURL=', ';\n//# sourceMappingURL=')));
            next();
        }));

        var destination = options.dest || (global.release ? config.paths.dest.release.scripts : config.paths.dest.build.scripts);
        rebundle = function () {
            var startTime;
            startTime = new Date().getTime();
            return bundler.bundle().on('error', function () {
                return console.log(arguments);
            }).pipe(source(options.output)).pipe(gulp.dest(destination).on('end', function () {
                var time;
                time = (new Date().getTime() - startTime) / 1000;
                cb();
                return console.log('' + options.output.cyan + ' was browserified: ' + (time + 's').magenta);
            }));
        };
        if (isWatching) {
            bundler.on('update', rebundle);
        }
        return rebundle();
    };

    createBundles = function (bundles, cb) {
        //i feel so dirty for this hack but it works, and it's the best i can find right now
        var numBundles = bundles.length;
        return bundles.forEach(function (bundle) {
            return createBundle(bundle, function () {
                numBundles--;
                if (numBundles === 0) {
                    cb();
                }
            });
        });
    };

    gulp.task('browserify-omega', function (cb) {
        createBundles(files, cb);
    });

}).call(this);
