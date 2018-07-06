<template>
  <scroll id="list_view" :data="singerData">
    <ul>
      <li class="list-group" v-for="group in singerData">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item" v-for="item of group.items">
            <img class="avatar" v-lazy="item.avatar" @click="click"/>
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>
</template>

<script>
import Scroll from '@/components/scroll/scroll';

export default {
  components: {
    Scroll
  },
  props: {
    singerData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
  @import './listview.scss';
</style>
