const webpackMerge = require("webpack-merge");
const { commonRendererConfig } = require("./common");

module.exports = webpackMerge.merge(commonRendererConfig("development"), {
  devtool: "eval-cheap-module-source-map",
  devServer: {
    port: 3003,
    static: "./dist",
  },
  optimization: {
    runtimeChunk: "single",
  },
});
