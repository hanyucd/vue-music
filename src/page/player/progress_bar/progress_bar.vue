<template>
  <div id="progress_bar" ref="progressBar">
    <article class="bar-inner">
      <!-- 已播放的进度 -->
      <section class="progress" ref="progress"></section>
      <!-- 当前进度小球 -->
      <section class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"></div>
      </section>
    </article>
  </div>
</template>

<script>
const PROGRESS_BTN = 16;

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    // 播放进度
    percent(newPercent) {
      if (newPercent >= 0) {
        let barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN;
        let offsetWidth = newPercent * barWidth;
        this.$refs.progress.style.width = `${ offsetWidth }px`;
        this.$refs.progressBtn.style.transform = `translate3d(${ offsetWidth }px, 0, 0)`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './progress_bar.scss';
</style>
