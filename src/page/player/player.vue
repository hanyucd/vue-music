<template>
  <div id="player" v-show="playlist.length > 0">
    <!-- 最大化的播放器 -->
    <transition name="normal">
      <section class="normal-player" v-show="fullScreen">
        <!-- 背景图 -->
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%"/>
        </div>
        <!-- 播放器顶部 -->
        <div class="top">
          <!-- 返回按钮 -->
          <div class="back" @click="miniPlayer">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 播放器中间 -->
        <div class="middle">
          <!-- 唱片 -->
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd" :class="[ playing ? 'play' : 'play pause' ]">
                <img :src="currentSong.image" class="image" />
              </div>
            </div>
          </div>
        </div>
        <!-- 播放器底部 -->
        <div class="bottom">
          <!-- 播放进度 -->
          <section class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" v-on:percentChange="onPercentChange"></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </section>

          <section class="operators">
            <!-- 歌曲播放模式 icon -->
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <!-- 左切换 icon -->
            <div class="icon i-left">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <!-- 中间播放 icon -->
            <div class="icon i-center">
              <i :class="[ playing ? 'icon-pause' : 'icon-play' ]" @click="togglePlaying"></i>
            </div>
            <!-- 右切换 icon -->
            <div class="icon i-right">
              <i class="icon icon-next" @click="nextSong"></i>
            </div>
            <!-- 收藏 icon -->
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </section>
        </div>
      </section>
    </transition>

    <!-- 最小化的播放器 -->
    <transition name="mini">
      <section class="mini-player" v-show="!fullScreen" @click="maxPlayer">
        <div class="icon">
          <img :class="[ playing ? 'play' : 'play pause' ]" :src="currentSong.image" width="40" height="40" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i class="icon-mini" :class="[ playing ? 'icon-pause-mini' : 'icon-play-mini' ]" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </section>
    </transition>
    <!-- 播放器 -->
    <audio
      ref="audio"
      :src="currentSong.url"
      @play="canplay"
      @error="error"
      @timeupdate="timeUpdate"
    >
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import ProgressBar from './progress_bar/progress_bar';

export default {
  components: {
    ProgressBar
  },
  data() {
    return {
      songCanPlay: false, // 定义歌曲播放 标志位
      currentTime: 0 // 当前播放时间
    };
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex'
    ]),
    // 计算出播放时长比例
    percent() {
      return this.currentTime / this.currentSong.duration;
    }
  },
  watch: {
    // 监听当前所加载歌曲
    currentSong() {
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    // 监听歌曲播放状态 | 播放 or 暂停
    playing(newValue) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newValue ? audio.play() : audio.pause();
      });
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    /*
     * 最小化播放器
     */
    miniPlayer() {
      this.setFullScreen(false);
    },
    /*
     * 最大化播放器
     */
    maxPlayer() {
      this.setFullScreen(true);
    },
    /*
     * 控制 播放/暂停 歌曲
     */
    togglePlaying() {
      this.setPlayingState(!this.playing);
    },
    /*
     * 切换下一首歌
     */
    nextSong() {
      if (!this.songCanPlay) return;

      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songCanPlay = false;
    },
    /*
     * 切换上一首歌
     */
    prevSong() {
      if (!this.songCanPlay) return;

      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songCanPlay = false;
    },
    /*
     * 当播放器开始播放音频时 触发
     */
    canplay() {
      this.songCanPlay = true;
    },
    /*
     * 当播放器加载期间发生错误时 触发
     */
    error() {
      this.songCanPlay = true;
    },
    /*
     * 当播放器播放位置改变时 连续触发
     */
    timeUpdate(event) {
      this.currentTime = event.target.currentTime;
    },
    /*
     * 格式化歌曲时长
     */
    format(interval) {
      interval = Math.floor(interval);
      const minute = Math.floor(interval / 60);
      const second = this._pad(interval % 60);
      return `${ minute }:${ second }`;
    },
    // 补零
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = '0' + num;
        len++;
      }
      return num;
    },
    /*
     * 监听子组件派发的事件 | 重设歌曲播放位置
     */
    onPercentChange(percent) {
      this.$refs.audio.currentTime = percent * this.currentSong.duration;
      // 进度改变后自动播放
      if (!this.playing) {
        this.togglePlaying();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './player.scss';
</style>
