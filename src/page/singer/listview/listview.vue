<template>
  <!-- refs | 引用指向组件实例 -->
  <scroll id="list_view"
    :data="singerData"
    :listenScroll="listenScroll"
    :probeType="probeType"
    ref="listview"
    v-on:scroll="scroll"
  >
    <ul>
      <li class="list-group" v-for="(group, index) in singerData" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item" v-for="(item, index) of group.items" :key="index" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar" alt="" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
     <!-- 右侧字母列表 -->
    <article class="letter-container"
      @touchstart="letterTouchStart($event)"
      @touchmove.stop="letterTouchMove($event)"
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) of letterList"
          :key="index"
          :data-index="index"
          :class="{ 'current': currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </article>
     <!-- 滚动固定标题实现 -->
    <article class="list-fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </article>
    <!-- loading 组件 -->
    <article class="loading-container" v-show="!singerData.length">
      <loading></loading>
    </article>
  </scroll>
</template>

<script>
import Scroll from '@/components/scroll/scroll';
import Loading from '@/components/loading/loading';
import { getData } from '@/assets/js/dom';

// 单行字母高度 px
const LETTER_LINE_HEIGHT = 18;

export default {
  components: {
    Scroll,
    Loading
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
    return {
      scrollY: -1, // better-scroll 实时滚动位置
      currentIndex: 0
    };
  },
  computed: {
    // 字母排列数组
    letterList() {
      return this.singerData.map(item => {
        return item.title.substr(0, 1); // 从起始索引号提取字符串中指定数目的字符
      });
    },
    // 歌手列表顶部 title
    fixedTitle() {
      if (this.scrollY > 0) return '';

      return this.singerData[this.currentIndex]
        ? this.singerData[this.currentIndex].title
        : '';
    }
  },
  watch: {
    singerData() {
      setTimeout(() => {
        this._caclHeight();
      }, 20);
    },
    // 监听 scrollY 落在 leftListHeight 的哪个区间，实现高亮联动
    scrollY(newY) {
      const listHeight = this.listHeight;

      // 当滚动到顶部，newY > 0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height_1 = listHeight[i];
        let height_2 = listHeight[i + 1];

        if (-newY >= height_1 && -newY < height_2) {
          this.currentIndex = i;
          return;
        }
      }
      // 当滚动到底部，且 -newY 大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    }
  },
  created() {
    // 组件实例化完成创建一个 空对象
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，
    // 而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
    this.probeType = 3;
  },
  methods: {
    /*
     * touchstart 事件 | 当手指放在屏幕上触发
     */
    letterTouchStart(event) {
      event.preventDefault();
      // event.target: 触发此事件的目标节点 | 变相获得字母下标
      let anchorIndex = getData(event.target, 'index');
      // 当前位于屏幕上的所有手指的一个列表 | 下标 0 取第一个
      let firstTouch = event.touches[0];
      // 触摸目标在页面中的 y 坐标 | 添加到 touch 对象中
      this.touch.y_1 = firstTouch.pageY;
      // 第一次触摸屏幕的字母 index
      this.touch.startIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    /*
     * touchmove 事件 | 当手指在屏幕上滑动时，连续地触发
     */
    letterTouchMove(event) {
      let firstTouch = event.touches[0];
      // 触摸目标在页面中的 y 坐标
      this.touch.y_2 = firstTouch.pageY;
      //  两次 touch y 轴偏移值 | 取整
      let offset = Math.floor((this.touch.y_2 - this.touch.y_1) / LETTER_LINE_HEIGHT);
      let nowIndex = parseInt(this.touch.startIndex) + offset;
      this._scrollTo(nowIndex);
    },
    /*
     * 封装滚动
     */
    _scrollTo(index) {
      if (!index && index !== 0) return;

      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      // 通过 refs 得到子组件实例，从而访问子组件方法
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 2000); // 滚动动画执行的时长 2s
    },
    /*
     * 监听子组件派发的事件
     */
    scroll(pos) {
      // 实时获取滚动 Y 轴位置
      this.scrollY = pos.y;
    },
    /*
     * 计算歌手列表 Group 高度
     */
    _caclHeight() {
      this.listHeight = [];
      // 每组字母歌手列表数组
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);

      for (let item of list) {
        // 获取内容的可视高度（不包括边框，边距或滚动条）
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    /*
     * 向父组件派发事件 | 传值
     */
    selectItem(item) {
      this.$emit('select', item);
    },
    /*
     * 对父亲提供的刷新 better-scroll 方法
     */
    refresh() {
      this.$refs.listview.refresh();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './listview.scss';
</style>
