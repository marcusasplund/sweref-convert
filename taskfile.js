const browserSync = require('browser-sync')
let isWatching = false
let isServer = false

export async function reload (task) {
  isWatching && isServer && browserSync.reload()
}

// some source/dest consts
const target = 'dist'
const releaseTarget = 'release'
const applicationId = 'sweref-convert'

const src = {
  js: 'src/**/*.js',
  scss: 'src/styles/app.scss',
  staticAssets: [
    'src/static/**/*.*',
    'src/*.html'
  ]
}

export async function cache (task) {
  await task.source('release/**/*.{js,html,css,png,jpg,gif,woff,woff2}')
    .precache({
      cacheId: `${applicationId}`,
      stripPrefix: 'release/'
    })
    .target(`${releaseTarget}`)
}

export async function clean (task) {
  await task.clear([target, releaseTarget])
}

export async function copyStaticAssets (task, o) {
  await task.source(o.src || src.staticAssets).target(target)
}

export async function js (task) {
  await task.source('src/index.js').rollup({
    rollup: {
      plugins: [
        require('rollup-plugin-buble')({
          jsx: 'h',
          transforms: {
            dangerousForOf: true
          },
          objectAssign: 'Object.assign'
        }),
        require('rollup-plugin-commonjs')({
          include: 'node_modules/**'
        }),
        require('rollup-plugin-replace')({
          'process.env.NODE_ENV': JSON.stringify(isWatching ? 'development' : 'production')
        }),
        require('rollup-plugin-node-resolve')({
          browser: true,
          main: true
        })
      ]
    },
    bundle: {
      format: 'iife',
      sourceMap: isWatching,
      moduleName: 'window'
    }
  }).target(`${target}`)
}

export async function styles (task) {
  await task.source(src.scss).sass({
    outputStyle: 'compressed',
    includePaths: ['./node_modules']
  })
  .postcss({
    plugins: [require('autoprefixer')({
      browsers: ['last 2 versions']
    })]
  }).target(`${target}`)
}

export async function build (task) {
    // TODO add linting
  await task.serial(['clean', 'copyStaticAssets', 'styles', 'js'])
}

export async function release (task) {
  await task.source(`${target}/*.js`).uglify({
    compress: {
      conditionals: 1,
      drop_console: 1,
      comparisons: 1,
      join_vars: 1,
      booleans: 1,
      loops: 1
    }
  }).target(target)
  await task.source(`${target}/**/*`).rev({
    ignores: ['.html', '.png', '.svg', '.ico', '.xml', '.json', '.txt', '.ttf', '.otf', '.woff', '.woff2']
  }).revManifest({dest: releaseTarget, trim: target}).revReplace().target(releaseTarget)
  await task.source(`${releaseTarget}/*.html`).htmlmin().target(releaseTarget)
  await task.serial(['cache'])
}

export async function watch (task) {
  isWatching = true
  await task.start('build')
  await task.watch(src.js, ['js', 'reload'])
  await task.watch(src.scss, ['styles', 'reload'])
  await task.watch(src.staticAssets, ['copyStaticAssets', 'reload'])
  await task.start('serve')
}

export async function serve (task) {
  isServer = 1
  browserSync({
    logPrefix: `${applicationId}`,
    server: target,
    port: process.env.PORT || 4000,
    cors: false,
    middleware: [
      require('connect-history-api-fallback')()
    ]
  })
}
