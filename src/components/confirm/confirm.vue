<template>
  <transition name="confirm-fade">
    <article id="confirm" v-show="showFlag">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{ text }}</p>
          <section class="operate">
            <div class="operate-btn left" @click="cancel">{{ cancelText }}</div>
            <div class="operate-btn" @click="confirm">{{ confirmText }}</div>
          </section>
        </div>
      </div>
    </article>
  </transition>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '你确定吗？'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
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
    },
    confirm() {
      this.hide();
      this.$emit('confirm');
    },
    cancel() {
      this.hide();
      this.$emit('cancel');
    }
  }
};
</script>

<style lang="scss">
  @import './confirm.scss';
</style>
