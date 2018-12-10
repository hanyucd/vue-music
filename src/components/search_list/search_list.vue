<template>
  <div id="search_list">
    <ul>
      <li class="search-item" v-for="(item, index) of searches" :key="index" @click="selectItem(item)">
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item);
    },
    deleteItem(item) {
      this.$emit('delete', item);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/const.scss';
  @import '@/assets/scss/mymixin.scss';

  #search_list {
    .search-item {
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      .text {
        flex: 1;
        color: $color-text-l;
      }
      .icon {
        @include extend-click();
        .icon-delete {
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
</style>
