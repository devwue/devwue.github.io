<template>
  <div class="markdown-body">
    <div v-html="contents"></div>
  </div>
</template>

<script lang="ts">
/* tslint:disabled */
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import marked from "marked"
import techStory from '@/post-data.json'
import lifeStory from '@/life-data.json'

export default defineComponent({
  name: 'Post',
  data() {
    return {
      contents: ''
    }
  },
  methods: {
    getView() {
      return String(useRoute().name);
    },
    wrLog(message: string) {
      console.log(this.getView() + '=> ' + message);
    }
  },
  created() {
    const route = useRoute()
    const postName = computed(() => route.params.postName as string)
    const host = process.env.VUE_APP_BASE
    const docsUrl = process.env.VUE_APP_DOCS
    const url = host + docsUrl + '/' + postName.value + '.md'
    console.log('created', url, postName.value)

    const posts = [
      ...techStory,
      ...lifeStory,
    ]

    const item = computed(() => {
      return posts.find(p => p.Page.endsWith(postName.value))
    })

    useHead(() => ({
      title: item.value ? item.value.Name : '은퇴한 IT개발자의 블로그',
      meta: [ {name: 'description', content: item.value?.Name ?? '은퇴한 IT개발자의 블로그'} ]
    }))

    marked.setOptions({
      gfm: true,
      breaks: true
    })
    marked.use({
      renderer: {
        text(text) {
          return text.replace(/[“"](.*?)[”"]/g, '<span class="quote">❝$1❞</span>')
            .replace(/==([^=]+)==/g, '<span class="md-highlight">$1</span>')
            .replace(/!!(.+)!!/g, '<span class="md-warning">$1</span>')
            .replace(/@([a-zA-Z0-9_]+)/g, '<span class="md-mention">@$1</span>')
        }
      }
    });
    this.$http.get(url)
        .then((response: any) => {
          this.contents = marked(response.data)
        })
        .catch((error: any) => {
          this.wrLog(error.response);
          console.log(error)
        })
    console.log(this.getView())
  }
})
</script>
