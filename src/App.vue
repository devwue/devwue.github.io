<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
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
ul {list-style: none}
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
</style>
