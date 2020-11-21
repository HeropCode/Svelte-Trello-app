# Svelte Trello clone app

[Svelte.js](https://svelte.dev)를 사용하는 Trello 클론 프로젝트입니다.<br>
주요 내용은 해당 강의를 참고하세요.

[Svelte.js Core API 완벽 가이드](https://www.inflearn.com/course/스벨트-완벽-가이드?inst=c1552804)

[DEMO](https://boring-agnesi-165a0d.netlify.app/)

![demo gif](https://github.com/HeropCode/Svelte-Trello-app/blob/master/assets/svelte-trello-example.gif)

## Snowpack 버전

이 프로젝트에서 사용하는 [Rollup](https://rollupjs.org/guide/en/) 은 프로젝트 빌드를 위한 이미 훌륭한 번들러이지만,<br>
새롭게 등장한 다음 세대 빌드 도구인 [Snowpack](https://heropy.blog/2020/10/31/snowpack/) 이 많은 주목을 받고 있습니다.<br>
Snowpack는 Svelte를 공식적으로 지원하며, Svelte도 Snowpack을 사용한 새로운 템플릿을 준비하고 있습니다.<br>
관련해 Svelte와 Snowpack으로 프로젝트를 어떻게 구성할 수 있는지 학습할 수 있도록 예제를 준비했습니다.<br>
이 프로젝트를 Snowpack으로 어떻게 이관하는지 [Svelte Trello clone app with Snowpack](https://github.com/HeropCode/Svelte-Trello-app-Snowpack) 에서 확인하세요!

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

> 어김없이 예제와 강의를 준비하는 동안 일부 모듈의 버전이 변경되면서 문제가 발생하네요.<br />
> 문제없이 실습할 수 있는 가장 좋은 방법은 설치할 모듈을 완성 예제의 `package.json` 버전과 동일하게 관리하는 것입니다.<br />
> 완성 예제의 `package.json` 파일 내용을 실습 프로젝트의 `package.json` 파일에 그대로 복사/붙여넣기 하고 터미널에 `npm i`(`npm install`)를 입력하세요.<br />
> 그러면 혹시 기존에 설치된 모듈이 있더라도 `package.json`에 맞게 설치/수정/삭제되니, 쉽게 완성 예제와 동일 환경으로 실습할 수 있습니다. 

- @rollup/plugin-alias: 경로 별칭을 사용해 더 편리하게 모듈을 가져올 수 있습니다.
- @rollup/plugin-strip: 배포용 제품은(개발 모드가 아닐 때) `console.log` 같은 Console 명령을 제거하는 것이 좋습니다.
- rollup-plugin-node-builtins: Node 내장 API를 사용할 수 있습니다.
- rollup-plugin-node-globals: 일부 Node 모듈이 필요로 하는 전역 API를 사용할 수 있습니다.
- rollup-plugin-replace: 번들 파일의 문자를 대체합니다. 문제가 발생하는 코드를 다른 코드(코드)로 대체 실행하기 위해 사용합니다.
- svelte-preprocess: PostCSS(Autoprefixer), SCSS, TypeScript 등을 지원하는 Svelte 전 처리기입니다.
- autoprefixer: CSS에 자동으로 공급 업체 접두사(Vendor prefix)를 적용합니다.(9버전을 사용하면 내부에서 postcss를 설치합니다, 10버전 이상은 postcss를 별도 설치해야 합니다)
- node-sass: SCSS를 CSS로 컴파일합니다.
- crypto-random-string: ID로 사용할 고유한 랜덤 문자열을 생성합니다.
- sortablejs: Drag and Drop으로 목록을 쉽게 정렬할 수 있습니다.
- lodash: 다양한 유틸리티 기능을 제공하는 자바스크립트 라이브러리입니다.

추가 패키지를 다음과 같이 한번에 설치할 수 있습니다.<br />
(일부 모듈 버전에 변경되면서 강의 내용과 진행이 달라지는 문제가 발생할 수 있어 모든 모듈에 버전을 일괄 명시했으니 참고하세요)

```bash
$ npm i -D @rollup/plugin-alias@3.1.1 @rollup/plugin-strip@^2.0.0 rollup-plugin-node-builtins@^2.1.2 rollup-plugin-node-globals@^1.4.0 rollup-plugin-replace@^2.2.0 svelte-preprocess@^4.1.2 autoprefixer@^9.8.6 node-sass@^4.14.1 crypto-random-string@3.2.0 sortablejs@^1.10.2 lodash@^4.17.20
```

## 확인하세요!

### node-sass

Svelte `<style>`에서 SCSS를 사용할 때,<br />
`node-sass`를 설치해도 VS Code에서 다음과 같은 에러가 발생할 수 있습니다.

```error
Cannot find any of modules: sass,node-sass ...
```

![Cannot find node-sass module](https://github.com/HeropCode/Svelte-Trello-app/blob/master/assets/issue1-cannot-find-module-node-sass.jpg)

확장 프로그램 **Svelte for VS Code**의 환경설정에서,<br />
`Svelte > Language-server: Runtime` 옵션에 NodeJS 설치 경로를 입력하세요.<br />
NodeJS 설치 경로는 터미널에서 다음과 같이 입력해 확인할 수 있습니다.

```bash
# for Mac
$ which node

# for Windows
$ where node
``` 

![Svelte for VS Code extension settings](https://github.com/HeropCode/Svelte-Trello-app/blob/master/assets/issue1-svelte-for-vs-code-extension-settings.jpg)

![Svelte language server: runtime](https://github.com/HeropCode/Svelte-Trello-app/blob/master/assets/issue1-language-server-runtime.jpg)

설정 완료 후 VS Code를 재부팅하세요!
