<template>
  <div class="about">
    <textarea id="about"></textarea>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    msg: String
  }
})
export default class About extends Vue {
  msg!: string;
}
</script>
