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
                <img :src="currentSong.image" class="image"/>
              </div>
            </div>
          </div>
        </div>
        <!-- 播放器底部 -->
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i :class="[ playing ? 'icon-pause' : 'icon-play' ]" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
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
      controls
    >
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing'
    ])
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
      setPlayingState: 'SET_PLAYING_STATE'
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
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './player.scss';
</style>
