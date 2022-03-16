# Vue CLI - 복잡한 사이트 맵
> Vue 웹 앱에 대한 사이트 맵을 생성해 줍니다. <br>
> https://github.com/cheap-glitch/vue-cli-plugin-sitemap:w
* 설치 `vue add sitemap`
 
### Sitemap 직접 추가
```javascript
// vue.config.js
module.exports = {
    pluginOptions: {
        sitemap: {
            urls: [
                'https://devwue.github.io',
                'https://devwue.github.io/about',
            ],
        }
    }
}
```

### 라우터 스크립트를 읽어와서 처리하기
> Typescript 로 작성한 Vue App에선 안됨 

```javascript
// vue.config.js
require = require('esm')(module);
const { routes } = require('./src/routs.js');

module.exports = {
    pluginOptions: {
        sitemap: {
            baseURL: 'https://devwue.github.com',
            routes,
        }
    }
}
// src/routes.js
export const routes = [
    { 
        path: '/',
        name: 'home',
        component: () => import('./views/Home.vue')
    }
];
```