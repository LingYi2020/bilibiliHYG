const { resolve } = require('path');
const HWP = require('html-webpack-plugin');
const MEP = require('mini-css-extract-plugin');
const OCAWP = require('optimize-css-assets-webpack-plugin');
// 设置nodejs环境变量
process.env.NODE_ENV = 'development';

module.exports = {
  entry: ['./src/js/index.js', './src/index.html'], // 入口
  output: { // 输出
    filename: 'js/main.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [MEP.loader, 'css-loader', 'less-loader'],
      }, {
        /**
         * 图片处理压缩
         */
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024, // 图片小于8kb进行base64处理
          name: '[hash:10].[ext]',
          outputPath: 'img',
          // publicPath: 'img/'
        },
      }, {
        /**
         * html文件里引入的img图片处理
         */
        test: /\.html$/,
        loader: 'html-loader', // 处理html里引入的图片
      }, {
        /**
         * JS兼容性处理：babel-loader @babel/plugin-transform-runtime
         *
         */
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'entry', // 按需加载'usage'
                corejs: {
                  version: 3,
                },
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17',
                },
              },
            ],
          ],
          // 利用 @babel/plugin-transform-runtime 插件还能以沙箱垫片的方式防止污染全局， 并抽离公共的 helper function , 以节省代码的冗余
          plugins: ['@babel/plugin-transform-runtime'],
        },
      }, {
        /**
         * 其他文件处理-->直接引用
         */
        exclude: /\.(css|js|html|less|jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media',
        },
      },
    ],
  },
  plugins: [
    new HWP({
      template: './src/index.html',
      // 压缩html代码
      minify: {
        collapseWhitespace: true, // 移除空格
        removeComments: true, // 移除注释
      },
    }),
    new MEP({
      // 为合并的css重命名
      filename: 'css/build.css',
    }),
    new OCAWP(), // 调用即可压缩css
  ],
  mode: 'production', // 开发模式
  // 生产模式自动压缩JS代码：
  // mode: production
  devServer: {
    contentBase: resolve(__dirname, 'bulid'), // 项目构建路径
    compress: true, // 启动gzip压缩
    port: 3000, // 端口号
    open: true, // 自动打开浏览器
  },

};
