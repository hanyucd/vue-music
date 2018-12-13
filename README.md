# vue-music

> Vue 搭建音乐 Webapp.

## 技术栈

- `Vue :` 用于构建用户界面的 MVVM 框架
- `Vue-Router :` 单页面应用路由管理器
- `Vuex :` 集中式存储管理应用的所有状态
- `Scss :` CSS 预编译处理器 | 使编写样式代码结构化
- `Axios :` 基于 Promise 的 HTTP 库 | 用来请求数据
- `ES6 :` ECMAScript 新一代语法

## 项目结构

<pre>

|-- build                            // 项目构建（webpack）相关代码
|-- config                           // 项目开发环境配置
|-- src                              // 源码目录
|   |-- api                          // 与后台数据交互的接口文件
|   |-- assets                       // font | img | js | scss
|   |-- components                   // 项目公共组件
|   |-- page                         // 项目页面组件
|   |-- router                       // vue 的路由管理
|   |-- store                        // vue 的状态管理
|   |-- App.vue                      // 页面入口文件
|   |-- main.js                      // 程序入口文件，加载各种公共组件
|-- static                           // 静态文件，比如一些图片，JSON 数据等
|-- .babelrc                         // ES6 语法编译配置
|-- .editorconfig                    // 定义代码格式
|-- .gitignore                       // git 上传需要忽略的文件格式
|-- .postcsssrc                      // postcss 配置文件
|-- README.md                        // 项目说明
|-- index.html                       // 入口页面
|-- package.json                     // 项目基本信息,包依赖信息等

</pre>

## 项目展示

![项目](./static/vue_music.gif)

## 项目运行

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

![thank](./static/thank.jpg "fork & star")
