<template>
  <div id="progress_bar" ref="progressBar" @click="progressClick">
    <article class="bar-inner">
      <!-- 已播放的进度 -->
      <section class="progress" ref="progress"></section>
      <!-- 当前进度小球 -->
      <section
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </section>
    </article>
  </div>
</template>

<script>
// 进度小球宽度
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
      if (newPercent >= 0 && !this.touch.init) {
        // 进度条总长
        let barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN;
        let offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  },
  created() {
    // 用于共享 touch 状态
    this.touch = {};
  },
  methods: {
    /*
     * 封装 进度条偏移值 & 小球偏移值
     */
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${ offsetWidth }px`;
      this.$refs.progressBtn.style.transform = `translate3d(${ offsetWidth }px, 0, 0)`;
    },
    /*
     * 拖动小球改变播放进度 | 小球滑动开始位置
     */
    progressTouchStart(event) {
      this.touch.init = true;
      // 记录开始滑动的位置
      this.touch.startX = event.touches[0].pageX;
      // 记录已经偏移值
      this.touch.left = this.$refs.progress.clientWidth;
    },
    /*
     * 拖动小球改变播放进度 | 小球滑动过程中
     */
    progressTouchMove(event) {
      if (!this.touch.init) return;
      // 滑动的差值
      let distance = event.touches[0].pageX - this.touch.startX;
      // 计算出进度条的偏移差值 | 大于 0，小于进度条总长度
      let offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - PROGRESS_BTN,
        Math.max(0, this.touch.left + distance)
      );
      this._offset(offsetWidth);
    },
    /*
     * 拖动小球改变播放进度，小球滑动结束
     */
    progressTouchEnd(event) {
      this.touch.init = false;
      this._triggerPercent();
    },
    /*
     * 点击进度条改变播放进度
     */
    progressClick(event) {
      // 返回一个矩形对象，包含四个属性：left、top、right、bottom | 分别表示元素各边与视口位置的距离。
      let rect = this.$refs.progressBar.getBoundingClientRect();
      let offsetWidth = event.pageX - rect.left;

      this._offset(offsetWidth);
      this._triggerPercent();
    },
    /*
     * 改变进度条进度后 像父组件派发进度比例而改变歌曲播放位置
     */
    _triggerPercent() {
      // 进度条总长
      let barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN;
      let percent = this.$refs.progress.clientWidth / barWidth;
      // 派发到父组件
      this.$emit('percentChange', percent);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './progress_bar.scss';
</style>
