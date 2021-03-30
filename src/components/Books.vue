<template>
  <div>
    <h2> 포스팅 검색 </h2>
    <input type='text' placeholder='Filter Search' v-model='query' /><button @click='reset'> Reset </button>
    <book-filter :query='query'/>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import BookFilter from './BookFilter.vue'
  export default {
    components: {
      BookFilter
    },
    setup () {
      const query = ref('')

      const reset = (evt) => {
        query.value = ''
      }
      
      return {
        reset,
        query
      }
    }
  }
</script>

<style>
  input[type='text'], input[type=button], button {
    margin-bottom: 3px;
    padding: 5px;
  }
</style>
