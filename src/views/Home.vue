<template>
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
export default class Home extends Vue {
  mounted() : void {
    console.log('home mounted')
  }
}
</script>
