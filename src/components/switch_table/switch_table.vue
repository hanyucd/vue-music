<template>
  <ul id="switch">
    <li class="switch-item"
      v-for="(item, index) of switches"
      :key="index"
      :class="{ active: currentIndex === index }"
      @click="switchItem(index)"
    >
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default() {
        return [];
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 开关切换，通知父组件
    switchItem(index) {
      this.$emit('switch', index);
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/const.scss';

  #switch {
    display: flex;
    align-items: center;
    width: 250px;
    margin: 0 auto;
    border: 1px solid $color-highlight-background;
    border-radius: 60px;
    overflow: hidden;
    .switch-item {
      flex: 1;
      padding: 8px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text-d;
      &.active {
        background: $color-highlight-background;
        color: $color-text;
      }
    }
  }
</style>
