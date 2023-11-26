let fileswatch = 'html,htm,txt,json,md,woff2, svg',
	SRC_PATH = 'src',
	DIST_PATH = 'dist',
	ASSETS_PATH = 'src/assets'

import pkg from 'gulp'
const { src, dest, parallel, series, watch } = pkg

import browserSync   from 'browser-sync'
import bssi          from 'browsersync-ssi'
import ssi           from 'ssi'
import webpackStream from 'webpack-stream'
import webpack       from 'webpack'
import TerserPlugin  from 'terser-webpack-plugin'
import gulpSass      from 'gulp-sass'
import * as dartSass from 'sass'
const sass          = gulpSass(dartSass)
import sassglob      from 'gulp-sass-glob'
import less          from 'gulp-less'
import lessglob      from 'gulp-less-glob'
import styl          from 'gulp-stylus'
import stylglob      from 'gulp-noop'
import postCss       from 'gulp-postcss'
import cssnano       from 'cssnano'
import autoprefixer  from 'autoprefixer'
import imagemin      from 'gulp-imagemin'
import changed       from 'gulp-changed'
import concat        from 'gulp-concat'
import rsync         from 'gulp-rsync'
import svgo          from 'gulp-svgo'
import svgSprite     from 'gulp-svg-sprite'
import {deleteAsync} from 'del'

function browsersync() {
	browserSync.init({
		server: {
			baseDir: `${SRC_PATH}/`,
			middleware: bssi({ baseDir: `${SRC_PATH}/`, ext: '.html' })
		},
		ghostMode: { clicks: false },
		notify: false,
		online: true,
		// tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
	})
}

function scripts() {
	return src([`${ASSETS_PATH}/js/*.js`, `!${ASSETS_PATH}/js/*.min.js`])
	.pipe(webpackStream({
		mode: 'production',
		performance: { hints: false },
		plugins: [],
		module: {
			rules: [
				{
					test: /\.m?js$/,
					exclude: /(node_modules)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: ['babel-plugin-root-import']
						}
					}
				}
			]
		},
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: { format: { comments: false } },
					extractComments: false
				})
			]
		},
	}, webpack)).on('error', function handleError() {
		this.emit('end')
	})
	.pipe(concat('main.min.js'))
	.pipe(dest(`${ASSETS_PATH}/js`))
	.pipe(browserSync.stream())
}

function styles() {
	return src([`${ASSETS_PATH}/styles/*.*`, `!${ASSETS_PATH}/styles/_*.*`])
		.pipe(eval(`sassglob`)())
		.pipe(eval(sass)({ 'include css': true }))
		.pipe(postCss([
			autoprefixer({ grid: 'autoplace' }),
			cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
		.pipe(concat('main.min.css'))
		.pipe(dest(`${SRC_PATH}/assets/css`))
		.pipe(browserSync.stream())
}

function images() {
	return src([`${ASSETS_PATH}/img/src/**/*`])
		.pipe(changed(`${ASSETS_PATH}/img`))
		.pipe(imagemin())
		.pipe(dest(`${ASSETS_PATH}/img`))
		.pipe(browserSync.stream())
}

function icons() {
	return src(`${ASSETS_PATH}/icons/src/*.svg`)
		.pipe(svgo({
			plugins: [
				{
					removeAttrs: {
						attrs: '(fill|stroke|style|width|height|data.*)'
					}
				}
			]
		}))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: `../main-sprite.svg`
				}
			}
		}))
		.pipe(dest(`${ASSETS_PATH}/icons`));
}

function buildcopy() {
	return src([
		`{${ASSETS_PATH}/js,${ASSETS_PATH}/css}/*.min.*`,
		`${ASSETS_PATH}/img/**/*.*`,
		`${ASSETS_PATH}/icons/main-sprite.svg`,
		`!${ASSETS_PATH}/img/src/**/*`,
		`${ASSETS_PATH}/fonts/**/*`,
		`${ASSETS_PATH}/video/**/*`
	], { base: `${SRC_PATH}/` })
	.pipe(dest(DIST_PATH))
}

async function buildhtml() {
	let includes = new ssi(`${SRC_PATH}/`, `${DIST_PATH}/`, '/**/*.html')
	includes.compile()
	await deleteAsync(`${DIST_PATH}/parts`, { force: true })
}

async function cleandist() {
	await deleteAsync(`${DIST_PATH}/**/*`, { force: true })
}

function deploy() {
	return src(`${DIST_PATH}/`)
		.pipe(rsync({
			root: `${DIST_PATH}/`,
			hostname: 'username@yousite.com',
			destination: 'yousite/public_html/',
			clean: true, // Mirror copy with file deletion
			// include: ['*.htaccess'], // Includes files to deploy
			exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
}

function startwatch() {
	watch([`${ASSETS_PATH}/styles/**/*`], { usePolling: true }, styles)
	watch([`${ASSETS_PATH}/js/**/*.js`, `!${ASSETS_PATH}/js/**/*.min.js`], { usePolling: true }, scripts)
	watch([`${ASSETS_PATH}/img/src/**/*`], { usePolling: true }, images)
	watch([`${ASSETS_PATH}/icons/src/**/*`], { usePolling: true }, icons)
	watch([`${SRC_PATH}/**/*.{${fileswatch}}`], { usePolling: true }).on('change', browserSync.reload)
}

export { scripts, styles, images, icons, deploy }
export let assets = series(scripts, styles, images, icons)
export let build = series(cleandist, images, icons, scripts, styles, buildcopy, buildhtml)

export default series(scripts, styles, images, icons, parallel(browsersync, startwatch))