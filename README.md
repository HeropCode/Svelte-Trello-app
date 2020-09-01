# Svelte Trello clone app

Svelte를 사용하는 Trello 클론 프로젝트입니다.

[DEMO](https://boring-agnesi-165a0d.netlify.app/)

![demo gif](https://github.com/HeropCode/Svelte-Trello-app/blob/master/assets/svelte-trello-example.gif)

## Svelte template(Rollup)으로 프로젝트 생성

```bash
# 원하는 경로에 접근
$ cd Desktop
# 프로젝트 생성
# npx degit sveltejs/template 프로젝트(폴더)_이름
$ npx degit sveltejs/template svelte-trello-app
# 생성한 프로젝트로 들어가기
$ cd svelte-trello-app
# 프로젝트 VSCode에서 열기(아래 명령이 동작하지 않으면 수동으로 열어주세요)
$ code .
```

## 기본 패키지

- @rollup/plugin-commonjs: CommonJS 모듈을 ES6로 변환합니다.(15버전을 사용합니다)
- @rollup/plugin-node-resolve: `node_modules`에서 써드파티 모듈을 사용하기 위해 필요합니다.(9버전을 사용합니다)
- rollup: 프로젝트를 번들링하는 핵심 패키지입니다.
- rollup-plugin-livereload: 실시간 Reload 서버를 사용합니다.
- rollup-plugin-svelte: Svelte 싱글 파일 컴포넌트(SFC)를 컴파일합니다.
- rollup-plugin-terser: 컴파일 결과를 압축해 더 작은 번들 결과를 만들 수 있습니다.
- svelte: SvelteJS 핵심 패키지입니다.
- sirv-cli: SPA 서버를 실행합니다.

기본 패키지를 다음과 같이 업데이트하세요.

```bash
$ npm i -D svelte@^3 @rollup/plugin-commonjs@^15 @rollup/plugin-node-resolve@^9
```

## 추가 패키지

- @rollup/plugin-alias: 경로 별칭을 사용해 더 편리하게 모듈을 가져올 수 있습니다.
- rollup-plugin-node-builtins: Node 내장 API를 사용할 수 있습니다.
- rollup-plugin-node-globals: 일부 Node 모듈이 필요로 하는 전역 API를 사용할 수 있습니다.
- svelte-preprocess: PostCSS(Autoprefixer), SCSS, TypeScript 등을 지원하는 Svelte 전 처리기입니다.
- autoprefixer: CSS에 자동으로 공급 업체 접두사(Vendor prefix)를 적용합니다.
- node-sass: SCSS를 CSS로 컴파일합니다.
- crypto-random-string: ID로 사용할 고유한 랜덤 문자열을 생성합니다.
- sortablejs: Drag and Drop으로 목록을 쉽게 정렬할 수 있습니다.
- lodash: 다양한 유틸리티 기능을 제공하는 자바스크립트 라이브러리입니다.

추가 패키지를 다음과 같이 한번에 설치할 수 있습니다.

```bash
$ npm i -D @rollup/plugin-alias rollup-plugin-node-builtins rollup-plugin-node-globals svelte-preprocess autoprefixer node-sass crypto-random-string sortablejs lodash
```
