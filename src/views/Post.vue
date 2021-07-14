<template>
  <div class="markdown-body">
    <div v-html="contents"></div>
  </div>
</template>

<script lang="ts">
/* tslint:disabled */
import { Options, PropOptions, Vue } from 'vue-class-component'
import { useRoute } from 'vue-router'
import marked from "marked"


export default class Post extends Vue {
  public contents: string = ''

  public getView() : any {
    return useRoute().name;
  }

  private wrLog(message: string) : void {
    console.log(this.getView() + '=> ' + message);
  }

  created (): void {
    const postName = this.$route.params.postName
    const host = process.env.VUE_APP_BASE
    const docsUrl = process.env.VUE_APP_DOCS
    const url = host + docsUrl + '/' + postName
    console.log('created', url)
    this.$http.get(url)
        .then((response) => {
          this.contents = marked(response.data)
        })
        .catch((error) => {
          this.wrLog(error.response);
          console.log(error)
        })
    console.log(this.getView())
  }
}
</script>
