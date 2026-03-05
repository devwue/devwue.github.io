<template>
  <div id="sub-nav">
    <router-link to="/daily/map">핫플레이스</router-link>
  </div>
  <div class="home">
    <Books/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Books from '@/components/Books.vue'

@Options({
  components: {
    Books
  }
})
export default class Daily extends Vue {
  mounted() : void {
    console.log('home mounted')
  }
}
</script>

<style scoped>

#sub-nav {
  padding: 0 0 30px;
}

#sub-nav a {
  font-weight: bold;
  color: #2c3e50;
}

#sub-nav a.router-link-exact-active {
  color: #42b983;
}
</style>
