const path = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

const target = 'web';
/**@type {import('webpack').Configuration} */
module.exports = {
  // 有development模式和production模式两种
  mode: "development",
  // 打包的入口文件地址
  entry: path.resolve(__dirname, "./src/client-entry.js"),
  devtool: "source-map",
  output: {
    // 打包输出文件名称
    filename: "bundle.js",
    // 打包输出地址
    path: path.resolve(__dirname, "./dist"),
    // 清除之前的打包文件
    // clean: true,
  },
  target,
  module: {
    rules: [
      {
        // 对项目中.js结尾的文件，使用babel-loader进行转义处理
        test: /\.js$/,
        loader: "babel-loader", // 排除node_modules
        options: {
          caller: { target },
        },
        exclude: /node_modules/,
      },
      {
        test: /\module.scss$/,
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: `assets/css/[name].css`,
      chunkFilename: `assets/css/[name].css`,
    }),
    new webpack.ProvidePlugin({
      react: "react",
      "react-dom": "react-dom"
    })
  ],
  // optimization: {
  //   minimize: true,
  //   moduleIds: "deterministic",
  //   minimizer: [
  //     new TerserWebpackPlugin({
  //       exclude: [],
  //       terserOptions: {
  //         format: {
  //           comments: false,
  //         },
  //       },
  //       extractComments: false,
  //     }),
  //   ],
  // },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
    name: "client",
  },
};
