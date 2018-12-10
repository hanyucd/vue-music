<template>
  <transition name="list-fade">
    <div id="play_list" v-show="showFlag" @click="hide">
      <article class="list-wrapper">
        <section class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </section>

        <section class="list-content">
          <ul>
            <li class="item">
              <i class="current"></i>
              <span class="text"></span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </section>

        <section class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </section>

        <section class="list-close" @click="hide">
          <span>关闭</span>
        </section>
      </article>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './play_list.scss';
</style>
