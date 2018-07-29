<template>
  <div id="song_list">
    <ul>
      <li class="item" v-for="(item, index) of songs" :key="item.id" @click="selectItem(item, index)">
        <section class="content">
          <h2 class="name">{{ item.name }}</h2>
          <p class="desc">{{ item | defDesc }}</p>
        </section>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      defaule: () => []
    }
  },
  // 过滤器
  filters: {
    defDesc(data) {
      // 重组数据
      return `${ data.singer } - ${ data.album }`;
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('select', item, index);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './song_list.scss';
</style>
