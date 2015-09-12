# Load some modules
# path = require 'path'
# sys = require 'sys'
# fs = require 'fs'
# es = require 'event-stream'
gulp = require 'gulp'


onError = (err) ->
  console.log(err.message)
  console.log(err.stack)
  this.emit('end')

# `nunjucks` is Mozilla's powerful templating library, see its [templating docs](http://mozilla.github.io/nunjucks/templating.html)
# nunjucks = require 'nunjucks'

# `minimist` parses command line arguments, like so:
# argv = require('minimist')(process.argv.slice(2))

# `gulp-load-plugins` loads all the modules in your `package.json` that begin with `gulp-` converting  dashes to camelcase, e.g. `'gulp-front-matter'` becomes `plugins.frontMatter`
gulpLoadPlugins = require 'gulp-load-plugins'
plugins = gulpLoadPlugins()

style_glob = ["css/*.less"]

gulp.task "less", ->
  gulp.src(style_glob).pipe(plugins.watch())
  .pipe(plugins.less()).pipe(plugins.continuousConcat('style.css'))
  .pipe(gulp.dest("./dist")).pipe(plugins.connect.reload())


js_glob = ["src/*.js", "lib/*.js", "src/*.coffee"]
# js_glob = ["src/*.js", "lib/a_underscore.js", "lib/*.js", "src/*.coffee"]
# Watch our coffeescript, and add it to our javascript
gulp.task "coffee", ->
  coffee_filter = plugins.filter("*.coffee")
  gulp.src(js_glob).pipe(plugins.watch())
  .pipe(plugins.plumber({errrorHandler:onError}))
  .pipe(coffee_filter).pipe(plugins.coffee({bare: true}).on('error', plugins.util.log)).pipe(coffee_filter.restore())
  .pipe(plugins.continuousConcat('script.js')).pipe(gulp.dest("./dist")).pipe(plugins.connect.reload())

gulp.task 'connect', ->
  plugins.connect.server
    root: './dist'
    livereload:
      port: 35735

gulp.task 'default', ['coffee', 'connect', 'less']


