<template>
  <div class="markdown-body">
    <div v-html="contents"></div>
  </div>
</template>

<script lang="ts">
/* tslint:disabled */
import { Options, PropOptions, Vue } from 'vue-class-component'
import marked from "marked"


export default class Post extends Vue {
  public contents: string = ''

  created (): void {
    const postName = this.$route.params.postName
    this.$http.get('/docs/' + postName)
        .then((response) => {
          this.contents = marked(response.data)
        });
  }
}
</script>
<style scoped>
* { text-align: left; }
@import "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css";
</style>
