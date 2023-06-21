const path = require("path");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const target = 'node';
/**@type {import('webpack').Configuration} */
module.exports = {
  // 有development模式和production模式两种
  mode: "development",
  // 打包的入口文件地址
  entry: path.resolve(__dirname, "./app.js"),
  devtool: "source-map",
  output: {
    // 打包输出文件名称
    filename: "server.js",
    // 打包输出地址
    path: path.resolve(__dirname, "./server"),
    // 清除之前的打包文件
    clean: true,
  },
  target,
  externals: [nodeExternals()],
  plugins: [
    new MiniCssExtractPlugin({
      filename: `assets/css/[name].css`,
      chunkFilename: `assets/css/[name].css`,
    }),
  ],
  module: {
    rules: [
      {
        // 对项目中.js结尾的文件，使用babel-loader进行转义处理
        test: /\.js$/,
        loader: "babel-loader", // 排除node_modules
        exclude: /node_modules/,
        options: {
          caller: { target },
        },
      },
      {
        test: /\.module.scss$/,
        use: [
          "isomorphic-style-loader",
          {
            loader: "css-loader",
            options: {
              esModule: false,
              modules: {
                localIdentName: "[name]_[local]_[hash:base64:5]",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [["autoprefixer"]],
              },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  // optimization: {
  //   minimize: false,
  //   moduleIds: "deterministic",
  // },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
    name: "server",
  },
};
