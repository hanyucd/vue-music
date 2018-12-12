<template>
  <transition name="list-fade">
    <div id="play_list" v-show="showFlag" @click="hide">
      <article class="list-wrapper" @click.stop>
        <section class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear" @click.stop="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </section>

        <scroll class="list-content" ref="scroll" :data="sequenceList">
          <ul>
            <li class="item" ref="songList" v-for="(item, index) of sequenceList" :key="index" @click.stop="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like" @click.stop="toggleFavoriteCls(item)">
                <i :class="getFavoriteCls(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </scroll>

        <section class="list-operate">
          <div class="add" @click.stop="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </section>

        <section class="list-close" @click="hide">
          <span>关闭</span>
        </section>
      </article>

      <!-- 清空弹窗 -->
      <confirm ref="confirm" text="确定清空历史记录" v-on:confirm="confirmClear"></confirm>

      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import Scroll from '@/components/scroll/scroll';
import Confirm from '@/components/confirm/confirm';
import AddSong from './add_song/add_song';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  data() {
    return {
      showFlag: false
    };
  },
  computed: {
    ...mapGetters([ 'sequenceList', 'currentSong', 'mode', 'playlist', 'favoriteList' ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) return;
      if (!this.showFlag || newSong.id === oldSong.id) return;

      this.scrollToCurrent(newSong);
    }
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList',
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 20);

      this.scrollToCurrent(this.currentSong);
    },
    hide() {
      this.showFlag = false;
    },
    /*
     * 显示正在播放的图标
     */
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play';
      }
    },
    /*
     * 点击当前歌曲播放
     */
    selectItem(item, index) {
      if (this.mode === 2) {
        index = this.playlist.findIndex(song => {
          return item.id === song.id;
        });
      }
      this.setCurrentIndex(index);
      // 如果是暂停，切歌后自动播放
      this.setPlayingState(true);
    },
    /*
     * 切歌后滚动至第一个
     */
    scrollToCurrent(current) {
      let index = this.sequenceList.findIndex(song => {
        return song.id === current.id;
      });
      this.$refs.scroll.scrollToElement(this.$refs.songList[index], 300);
    },
    /*
     * 删除单个歌曲
     */
    deleteOne(item) {
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.hide();
      }
    },
    /*
     * 显示弹窗
     */
    showConfirm() {
      this.$refs.confirm.show();
    },
    /*
     * 确认清空歌曲播放列表
     */
    confirmClear() {
      this.deleteSongList();
      this.hide();
    },
    /*
     * 显示添加歌曲列表
     */
    showAddSong() {
      this.$refs.addSong.show();
    },
    /*
     * 处理收藏 class 名
     */
    getFavoriteCls(song) {
      return this._isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite';
    },
    /*
     * 切换是否收藏
     */
    toggleFavoriteCls(song) {
      this._isFavorite(song) ? this.deleteFavoriteList(song) : this.saveFavoriteList(song);
    },
    /*
     * 判断是否已收藏
     */
    _isFavorite(song) {
      let index = this.favoriteList.findIndex(item => {
        return song.id === item.id;
      });
      return index > -1;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './play_list.scss';
</style>
