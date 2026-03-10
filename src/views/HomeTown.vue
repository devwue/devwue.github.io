<template>
  <div class="homeTown">
    <DailyMap />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DailyMap from '@/components/DailyMap.vue'

export default defineComponent({
  name: 'HomeTown',
  components: {
    DailyMap
  },
  mounted() {
    console.log('home mounted')
  }
})
</script>
