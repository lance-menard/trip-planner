const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const del = require('del');
const gulpBabel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const vinylPaths = require('vinyl-paths');
const dotenv = require('dotenv');

const babel = (config) => () =>
  gulp
    .src(['src/**/*.js', '!src/tests/**', '!src/**/*.test.js'], {
      cwd: process.env.INIT_CWD || process.cwd(),
      allowEmpty: true,
    })
    .pipe(sourcemaps.init())
    .pipe(gulpBabel(config))
    .on('error', console.error)
    .pipe(sourcemaps.write())
    .pipe(
      gulp.dest('dist', {
        cwd: process.env.INIT_CWD || process.cwd(),
      })
    );

const clean = () => () =>
  gulp
    .src(['dist/*', 'test-report.json'], {
      allowEmpty: true,
      cwd: process.env.INIT_CWD || process.cwd(),
    })
    .pipe(vinylPaths(del));

const copy = () => () =>
  gulp
    .src(
      [
        'src/**/*.json',
        'src/**/*.graphql',
        'src/**/*.key',
        'src/**/*.css',
        'src/**/*.scss',
      ],
      {
        allowEmpty: true,
        cwd: process.env.INIT_CWD || process.cwd(),
      }
    )
    .pipe(
      gulp.dest('dist', {
        cwd: process.env.INIT_CWD || process.cwd(),
      })
    );

const nodemonTask = () => (done) => {
  const monitor = nodemon({
    script: process.env.npm_package_main,
    watch: [
      'src',
      'config.js',
      'gulpfile.js',
      // ...getSymlinkedNodeModules(),
    ],
    delay: '1000',
    cwd: process.env.INIT_CWD || process.cwd(),
    ext: 'js json graphql key',
    tasks: ['build'],
    env: {
      FORCE_COLOR: 3,
      LOGGING_LOG_LEVEL: 'trace',
      ...dotenv.config({ path: '../../.env' }),
    },
    done,
  });

  process.once('SIGINT', function () {
    monitor.once('exit', function () {
      process.exit();
    });
  });
};

gulp.task('clean', clean());
gulp.task('copy', copy());
gulp.task('babel', babel());
gulp.task(
  'log',
  (done) => console.log('Change detected; rebuilding.') && done()
);

gulp.task('build', gulp.series('clean', 'copy', 'babel'));

gulp.task('nodemon', nodemonTask());

gulp.task('watch', gulp.series('build', 'nodemon'));
gulp.task('default', gulp.series('build'));
