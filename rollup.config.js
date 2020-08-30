import path from 'path';
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import sveltePreprocess from 'svelte-preprocess';

// Rollup Watch 기능(-w)이 동작하는 경우만 '개발 모드'라고 판단합니다.
const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		// 서버 있으면 바로 종료.
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			// 서버가 있으면 실행하지 않음.
			if (server) return;

			// 서버 생성.
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			// 프로세스 종료 이벤트(SIGTERM, exit)에 서버 종료하도록 핸들링.
			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	// 진입점.
	input: 'src/main.js',
	// 번들 출력.
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			},
			preprocess: sveltePreprocess({
				scss: {
					// 전역에서 사용할 SCSS 파일을 지정합니다.
					// 단, style 태그에 lang="scss"가 지정되어 있어야 합니다.
					prependData: '@import "./src/scss/main.scss";',
				},
				// PostCSS는 Autoprefixer를 설치하면 같이 설치됩니다.
				postcss: {
					plugins: [
						require('autoprefixer')()
					]
				}
			})
		}),

		// replace ~ builtins 까지는 다음과 같은 순서대로 작성해야 정상적으로 동작함에 주의합니다!
		// 대부분의 플러그인은 Rollup 측에서 제공하는 것이 아니기 때문에,
		// 플러그인의 동작 순서를 파악하는 것은 사용자(개발자)의 몫이라고 설명하고 있습니다.

		// Crypto-random-string에서 내부적으로 randomBytes가 사용됩니다.
		// Node Globals와 Builtins가 내부적으로 제공하지 않기 때문에,
		// 다음과 같이 지정(대체)해야 정상적으로 동작합니다.
		// https://github.com/sindresorhus/crypto-random-string/blob/master/index.js
		replace({
			values: {
				'crypto.randomBytes': 'require("randombytes")'
			}
		}),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		globals(),
		builtins(),

		// 상대 경로에 대한 별칭이 없으면, 프로젝트를 리팩토링할 때 문제가 생길 확률이 매우 높아집니다.
		alias({
			entries: [
				{ find: '~', replacement: path.resolve(__dirname, 'src/') }
			]
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
