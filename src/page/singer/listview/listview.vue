<template>
  <!-- refs | 引用指向组件实例 -->
  <scroll id="list_view" :data="singerData" ref="listview">
    <ul>
      <li class="list-group" v-for="(group, index) in singerData" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item" v-for="(item, index) of group.items" :key="index">
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
                                                              <!-- data-* 用于存储自定义数据 -->
        <li v-for="(item, index) of letterList" :key="index" class="item" :data-index="index">
          {{ item }}
        </li>
      </ul>
    </article>
  </scroll>
</template>

<script>
import Scroll from '@/components/scroll/scroll';
import { getData } from '@/assets/js/dom';

// 单行字母高度 px
const LETTER_LINE_HEIGHT = 18;

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
  },
  computed: {
    // 字母排列数组
    letterList() {
      return this.singerData.map(item => {
        return item.title.substr(0, 1); // 从起始索引号提取字符串中指定数目的字符
      });
    }
  },
  created() {
    // 组件实例化完成创建一个 空对象
    this.touch = {};
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
    // 封装滚动
    _scrollTo(index) {
      // 通过 refs 得到子组件实例，从而访问子组件方法
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 2000); // 滚动动画执行的时长 2s
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './listview.scss';
</style>
