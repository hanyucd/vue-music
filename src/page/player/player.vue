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
        <div
          class="middle"
          @touchstart="middleTouchStart"
          @touchmove ="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <!-- 唱片 -->
          <section class="middle-l" ref="middle_l">
            <div class="cd-wrapper">
              <div class="cd" :class="[ playing ? 'play' : 'play pause' ]">
                <img :src="currentSong.image" class="image" />
              </div>
            </div>
          </section>

          <!-- 歌词 -->
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                  :class="{ current: currentLyricLine === index }"
                  class="text"
                  ref="lyricLine"
                >
                {{ line.txt }}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 播放器底部 -->
        <div class="bottom">
          <!-- 分页点 -->
          <section class="dot-wrapper">
            <span class="dot" :class="{ active: currentDot === 'cd' }"></span>
            <span class="dot" :class="{ active: currentDot === 'lyric' }"></span>
          </section>

          <!-- 播放进度 -->
          <section class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" v-on:percentChange="onPercentChange"></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </section>

           <!-- 底部操作区 -->
          <section class="operators">
            <!-- 歌曲播放模式 icon -->
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
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
          <i :class="[ playing ? 'icon-pause-mini' : 'icon-play-mini' ]" @click.stop="togglePlaying"></i>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </section>
    </transition>

    <!-- 播放列表组件 -->
    <play-list ref="playList"></play-list>

    <!-- 播放器 -->
    <audio
      ref="audio"
      :src="currentSong.url"
      @play="canplay"
      @error="error"
      @timeupdate="timeUpdate"
      @ended="endPlay"
    >
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
// 导入子组件
import ProgressBar from './progress_bar/progress_bar';
import Scroll from '@/components/scroll/scroll';
import PlayList from '@/page/play_list/play_list';
// 导入工具函数
import { shuffle } from '@/assets/js/util';
// 导入第三方库
import Lyric from 'lyric-parser';

export default {
  components: {
    ProgressBar,
    Scroll,
    PlayList
  },
  data() {
    return {
      songCanPlay: false, // 定义歌曲播放 标志位
      currentTime: 0, // 当前播放时间
      currentLyric: null, // 当前歌曲的歌词
      currentLyricLine: 0, // 当前播放的歌词在第几行
      currentDot: 'cd' // 当前所处的分页
    };
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'sequenceList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode'
    ]),
    // 计算出播放时长比例
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    // 播放模式对应图标
    iconMode() {
      let styleClass = '';

      switch (this.mode) {
        case 0:
          styleClass = 'icon-sequence';
          break;
        case 1:
          styleClass = 'icon-loop';
          break;
        case 2:
          styleClass = 'icon-random';
          break;
      }

      return styleClass;
    }
  },
  watch: {
    // 监听当前所加载歌曲
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) return;

      // 切歌时，停止当前歌词
      if (this.currentLyric) {
        this.currentLyric.stop();
      }

      this.$nextTick(() => {
        this.$refs.audio.play();
        this._fetchLyric();
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
  created() {
    // 维护一个滑动状态对象
    this.touch = {};
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
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

      // 暂停时，歌词也暂停
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    /*
     * 切换下一首歌
     */
    nextSong() {
      if (!this.songCanPlay) return;

      // 如果播放列表只要一条数据
      if (this.playlist.length === 1) {
        this.loopSong();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
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
     * 当播放器播放结束时 触发
     */
    endPlay() {
      // mode：1 | 单曲循环模式
      if (this.mode === 1) {
        this.loopSong();
      } else {
        this.nextSong();
      }
    },
    /*
     * 单曲循环
     */
    loopSong() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      // 单曲循环时，歌词也单曲循环
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
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
      let currentTime = percent * this.currentSong.duration;
      this.$refs.audio.currentTime = currentTime;
      // 进度改变后自动播放
      if (!this.playing) {
        this.togglePlaying();
      }

      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    /*
     * 改变播放模式
     */
    changeMode() {
      let mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);

      let newList = null;
      // mode === 2：随机播放
      if (mode === 2) {
        // 获取随机打乱后的歌曲列表
        newList = shuffle(this.sequenceList);
      } else {
        // 顺序播放、单曲循环
        newList = this.sequenceList;
      }

      // 调整当前歌曲的索引 | findIndex: 返回符合回调函数条件的数组元素索引
      let index = newList.findIndex(item => {
        return item.id === this.currentSong.id;
      });

      this.setCurrentIndex(index);
      this.setPlayList(newList);
    },
    /*
     * 歌词处理
     */
    _fetchLyric() {
      this.currentSong.fetchLyric().then(lyric => {
        this.currentLyric = new Lyric(lyric, this._handleLyric);

        if (this.playing) {
          this.currentLyric.play();
        }
      }).catch(() => {
        this.currentLyric = null;
        this.currentLyricLine = 0;
      });
    },
    /*
     * new Lyric() 的回调函数
     */
    _handleLyric({ lineNum, txt }) {
      this.currentLyricLine = lineNum;

      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
    },
    /*
     * 滑动切换唱片/歌词 | 当手指放在屏幕上触发
     */
    middleTouchStart(event) {
      this.touch.init = true;
      // 记录开始滑动的位置
      this.touch.start_X = event.touches[0].pageX;
      this.touch.start_Y = event.touches[0].pageY;
    },
    /*
     * 滑动切换唱片/歌词 | 当手指在屏幕上滑动时，连续地触发
     */
    middleTouchMove(event) {
      if (!this.touch.init) return;

      // 计算滑动的差值
      let distance_X = event.touches[0].pageX - this.touch.start_X;
      let distance_Y = event.touches[0].pageX - this.touch.start_Y;

      if (Math.abs(distance_X) < Math.abs(distance_Y)) return;

      let left = this.currentDot === 'cd' ? 0 : -window.innerWidth;
      // 计算滑动的距离
      let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + distance_X));
      // 计算滑动距离占屏幕宽的比例
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);

      this.$refs.lyricList.$el.style['transform'] = `translate3d(${ offsetWidth }px, 0, 0)`;
      // Move过程中 过渡效果坚持 0ms
      this.$refs.lyricList.$el.style['transition-duration'] = 0;
      // 设置 cd 唱片图位移
      this.$refs.middle_l.style['transform'] = `translate3d(${ offsetWidth }px, 0, 0)`;
      this.$refs.middle_l.style['transition-duration'] = 0;
    },
    /*
     * 滑动切换唱片/歌词 | 当手指从屏幕上离开时触发
     */
    middleTouchEnd(event) {
      let offsetWidth;

      if (this.currentDot === 'cd') {
        // 向左滑 | 滑动距离大于屏幕宽度 20% 执行
        if (this.touch.percent > 0.2) {
          offsetWidth = -window.innerWidth;
          this.currentDot = 'lyric';
        } else {
          offsetWidth = 0;
        }
      } else {
        // 向右滑 | 滑动距离小于屏幕宽度 80% 执行
        if (this.touch.percent < 0.8) {
          offsetWidth = 0;
          this.currentDot = 'cd';
        } else {
          offsetWidth = -window.innerWidth;
        }
      }

      // 定义过渡时间 500 ms
      const duration = 500;
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${ offsetWidth }px, 0, 0)`;
      this.$refs.lyricList.$el.style['transition'] = `all ${ duration }ms linear`;
      // 设置 cd 唱片图位移
      this.$refs.middle_l.style['transform'] = `translate3d(${ offsetWidth }px, 0, 0)`;
      this.$refs.middle_l.style['transition'] = `all ${ duration }ms linear`;
    },
    /*
     * 显示播放列表
     */
    showPlayList() {
      this.$refs.playList.show();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './player.scss';
</style>
