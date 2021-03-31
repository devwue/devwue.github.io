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
    const host = process.env.VUE_APP_BASE
    const docsUrl = process.env.VUE_APP_DOCS
    const url = host + docsUrl + '/' + postName
    console.log('created', url)
    this.$http.get(url)
        .then((response) => {
          this.contents = marked(response.data)
        });
  }
}
</script>
