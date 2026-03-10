<script setup lang="ts">
import 'github-markdown-css/github-markdown.css'
import { useHead } from '@vueuse/head'

useHead({
  title: '은퇴한 IT개발자의 블로그',
  meta: [
    { name: 'description', content: '은퇴한 IT개발자의 블로그입니다.' },
    { property: 'og:title', content: '은퇴한 IT개발자의 블로그' },
    { property: 'og:description', content: '은퇴한 IT개발자의 블로그입니다.' },
  ]
})
</script>
<template>
  <div id="nav">
    <router-link to="/">IT 개발</router-link> |
    <router-link to="/daily">일상 생활</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <div id="content">
    <router-view/>
  </div>
  <div id="foobar">
    <p>Since 2021, Written by devwue.</p>
  </div>
</template>

<style>
* { margin: 0; padding: 0 }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#content {
  padding: 10px;
}
#foobar { clear: both; border-top: 1px solid #ccc; overflow: hidden; }
#foobar p { margin: 15px 0 }
.markdown-body { text-align: left; }
.markdown-body .quote {
  color: #d6336c;
  font-weight: bold;
  background: rgba(214, 51, 108, 0.08);
  padding: 2px 4px;
  border-radius: 4px;
}
.md-highlight {
  background: #fff3bf;
  color: #5f3dc4;
  padding: 2px 4px;
  border-radius: 4px;
}

.md-warning {
  background: #ffe3e3;
  color: #c92a2a;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 600;
}

.md-mention {
  background: #e7f5ff;
  color: #1971c2;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: 500;
}

.md-quote {
  color: #845ef7;
  background: rgba(132, 94, 247, 0.08);
  padding: 2px 4px;
  border-radius: 4px;
}

/* 취소선 */
del {
  color: #adb5bd;
  text-decoration-color: #ff6b6b;
  text-decoration-thickness: 2px;
}
</style>
