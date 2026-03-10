<template>
  <div class="markdown-body">
    <div v-html="profile"></div>
  </div>
</template>

<script lang="ts">
/* tslint:disabled */
import { defineComponent } from 'vue'
import marked from "marked"

export default defineComponent({
  name: 'About',
  data() {
    return {
      profile: '',
      profileRaw: ''
    }
  },
  created() {
    const host = process.env.VUE_APP_BASE
    const docsUrl = process.env.VUE_APP_DOCS
    const url = host + docsUrl + '/About.md'

    marked.setOptions({
      gfm: true,
      breaks: true
    })
    console.log(url);
    this.$http.get(url)
        .then((response: any) => {
          this.profileRaw = response.data;
          this.profile = marked(this.profileRaw)
        });
  },
  mounted() {
    console.log('mounted', 'init')
    if (this.profileRaw) {
      console.log('mounted', 'procc')
    }
  }
})
</script>
