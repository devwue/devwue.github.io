<template>
  <div class="markdown-body">
    <div v-html="profile"></div>
  </div>
</template>

<script lang="ts">
/* tslint:disabled */
import { Options, Vue } from 'vue-class-component'
import marked from "marked"

export default class About extends Vue {
  public profile: string = ''
  private profileRaw: string = ''

  created (): void {
    const host = process.env.VUE_APP_BASE
    const docsUrl = process.env.VUE_APP_DOCS
    const url = host + docsUrl + '/About.md'

    console.log(url);
    this.$http.get(url)
        .then((response) => {
          this.profileRaw = response.data;
          this.profile = marked(this.profileRaw)
        });
  }

  mounted () : void {
    console.log('mounted', 'init')
    if (this.profileRaw) {
      console.log('mounted', 'procc')
    }
  }
}
</script>
