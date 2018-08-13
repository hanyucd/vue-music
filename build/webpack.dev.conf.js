'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

/*
 * axios 结合 Express 做后端代理请求
 */
const express = require('express');
// body-parser是一个HTTP请求体解析中间件
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const router = express.Router();

app.use('/api', router);

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    // 新增 后端代理请求
    before(app) {
      app.use(bodyParser.urlencoded({ extended: true })); // 解析文本格式
      // 获取首页歌单数据
      app.get('/api/getDiscList', function(req, res) {
        let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';

        console.log(`\n ${ __filename }: 进入首页歌单列表请求后台代理...`);
        // 歌单列表代理
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data);
        }).catch(error => {
          console.log('歌单列表后台代理失败:', error);
        });
      });

      // 获取首页歌单详情数据
      app.get('/api/getSongList', function (req, res) {
        let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        console.log(`\n ${ __filename }: 进入歌单详情请求后台代理...`);
        // 歌单详情代理
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          let ret = response.data;
          // jsonp 数据转为 json 数据
          if (typeof ret === 'string') {
            let reg = /^\w+\(({[^()]+})\)$/;
            let matches = ret.match(reg);
            if (matches) {
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret)
        }).catch((error) => {
          console.log('歌单详情后台代理失败:', error);
        });
      });

      // 获取播放器歌曲歌词数据
      app.get('/api/lyric', function(req, res) {
        let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';

        console.log(`\n ${ __filename }: 进入歌词请求后台代理...`);
        // 歌词列表代理
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          let ret = response.data;
          // jsonp 数据转为 json 数据
          if (typeof ret === 'string') {
            let reg = /^\w+\(({[^()]+})\)$/;
            let matches = ret.match(reg);
            if (matches) {
              ret = JSON.parse(matches[1]);
            }
          }
          res.json(ret);
        }).catch(error => {
          console.log('歌词后台代理失败:', error);
        });
      });

      // 歌曲搜索
      app.get('/api/search', function(req, res) {
        let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

        console.log(`\n ${ __filename }: 进入歌曲搜索请求后台代理...`);
        // 歌曲搜索代理
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then(response => {
          res.json(response.data);
        }).catch(error => {
          console.log('歌曲搜索后台代理失败:', error);
        });
      });

      app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
        let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

        console.log(`\n ${ __filename }: 进入歌曲URL请求后台代理...`);

        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          res.json(response.data);
        }).catch(error => {
          console.log(error);
        });
      });
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: './static/favicon.ico'
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
