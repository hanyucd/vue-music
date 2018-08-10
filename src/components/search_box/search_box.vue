<template>
  <div id="search_box">
    <i class="icon-search"></i>
    <input class="box" type="text" v-model="query" :placeholder="placeholder" />
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    };
  },
  created() {
    this.$watch('query', (newQuery) => {
      this.$emit('query', newQuery);
    });
  },
  methods: {
    /*
     * 清空输入框
     */
    clear() {
      this.query = '';
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './search_box.scss';
</style>
