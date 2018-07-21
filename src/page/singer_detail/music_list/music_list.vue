<template>
  <div id="music_list">
  </div>
</template>

<script>
export function {
  props: {
    // 背景图
    bgImage: {
      type: String,
      default: ''
    },
    // 歌曲列表
    songs: {
      type: Array,
      default: () => []
    },
    title {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './music_list.scss';
</style>
