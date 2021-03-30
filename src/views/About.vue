<template>
  <div class="about">
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
    this.$http.get('/docs/About.md')
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
