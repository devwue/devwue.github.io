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
  private baseUri: string = 'https://devwue.github.io/docs/'

  created (): void {
    const postName = this.$route.params.postName
    const url = this.baseUri + postName;
    console.log('created', url)
    this.$http.get(url)
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
